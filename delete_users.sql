-- Delete Account 1
UPDATE audit_log SET user_id = NULL WHERE user_id = '2230f7cb-23c4-4158-b08a-838618fcf97e';
DELETE FROM recovery_codes WHERE user_id = '2230f7cb-23c4-4158-b08a-838618fcf97e';
DELETE FROM webauthn_credentials WHERE user_id = '2230f7cb-23c4-4158-b08a-838618fcf97e';
DELETE FROM sessions WHERE user_id = '2230f7cb-23c4-4158-b08a-838618fcf97e';
DELETE FROM users WHERE id = '2230f7cb-23c4-4158-b08a-838618fcf97e';

-- Delete Account 2
UPDATE audit_log SET user_id = NULL WHERE user_id = '27bfb82e-ee98-4213-86fc-095fa32574c9';
DELETE FROM recovery_codes WHERE user_id = '27bfb82e-ee98-4213-86fc-095fa32574c9';
DELETE FROM webauthn_credentials WHERE user_id = '27bfb82e-ee98-4213-86fc-095fa32574c9';
DELETE FROM sessions WHERE user_id = '27bfb82e-ee98-4213-86fc-095fa32574c9';
DELETE FROM users WHERE id = '27bfb82e-ee98-4213-86fc-095fa32574c9';
