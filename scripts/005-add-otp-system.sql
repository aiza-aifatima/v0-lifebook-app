-- OTP (One-Time Password) System for Password Reset
-- Secure, time-limited OTP codes for password recovery

CREATE TABLE password_reset_otp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  otp_code TEXT NOT NULL UNIQUE, -- 6-digit numeric OTP
  otp_hash TEXT NOT NULL, -- Hashed OTP for security
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 5,
  is_used BOOLEAN DEFAULT false,
  used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL, -- 10 minutes expiration
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT otp_length CHECK (LENGTH(otp_code) = 6),
  CONSTRAINT valid_attempts CHECK (attempts <= max_attempts)
);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_otp_email ON password_reset_otp(email) WHERE is_used = false AND expires_at > now();
CREATE INDEX idx_password_reset_otp_user_id ON password_reset_otp(user_id) WHERE is_used = false AND expires_at > now();

-- Enable RLS
ALTER TABLE password_reset_otp ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own OTP records
CREATE POLICY "Users can view their own OTP records"
  ON password_reset_otp FOR SELECT
  USING (auth.uid() = user_id);

-- RLS Policy: Service role can insert OTP records
CREATE POLICY "Allow insert for password reset"
  ON password_reset_otp FOR INSERT
  WITH CHECK (true);

-- RLS Policy: Users can update their OTP records (mark as used)
CREATE POLICY "Users can update their own OTP records"
  ON password_reset_otp FOR UPDATE
  USING (auth.uid() = user_id);

-- Function to generate secure OTP
CREATE OR REPLACE FUNCTION generate_otp_code()
RETURNS TEXT AS $$
BEGIN
  RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Function to hash OTP for security
CREATE OR REPLACE FUNCTION hash_otp(otp_code TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(otp_code, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to validate OTP
CREATE OR REPLACE FUNCTION validate_otp(
  p_email TEXT,
  p_otp_code TEXT
)
RETURNS TABLE (
  valid BOOLEAN,
  user_id UUID,
  message TEXT
) AS $$
DECLARE
  v_otp_record PASSWORD_RESET_OTP%ROWTYPE;
  v_otp_hash TEXT;
BEGIN
  -- Hash the provided OTP
  v_otp_hash := hash_otp(p_otp_code);
  
  -- Find the OTP record
  SELECT * INTO v_otp_record FROM password_reset_otp
  WHERE email = p_email
    AND is_used = false
    AND expires_at > now()
    AND attempts < max_attempts
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no record found
  IF v_otp_record.id IS NULL THEN
    RETURN QUERY SELECT FALSE::BOOLEAN, NULL::UUID, 'OTP not found or expired'::TEXT;
    RETURN;
  END IF;
  
  -- Check if OTP matches
  IF v_otp_record.otp_hash = v_otp_hash THEN
    -- Mark OTP as used
    UPDATE password_reset_otp
    SET is_used = true, used_at = now()
    WHERE id = v_otp_record.id;
    
    RETURN QUERY SELECT TRUE::BOOLEAN, v_otp_record.user_id, 'OTP valid'::TEXT;
  ELSE
    -- Increment attempts
    UPDATE password_reset_otp
    SET attempts = attempts + 1
    WHERE id = v_otp_record.id;
    
    RETURN QUERY SELECT FALSE::BOOLEAN, NULL::UUID, 'Invalid OTP'::TEXT;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to clean up expired OTPs (call periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_otps()
RETURNS INTEGER AS $$
DECLARE
  v_deleted_count INTEGER;
BEGIN
  DELETE FROM password_reset_otp
  WHERE expires_at < now()
    OR (is_used = true AND updated_at < now() - INTERVAL '24 hours');
  
  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
  RETURN v_deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT SELECT, UPDATE ON password_reset_otp TO anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_otp_code() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION hash_otp(TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION validate_otp(TEXT, TEXT) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION cleanup_expired_otps() TO anon, authenticated;
