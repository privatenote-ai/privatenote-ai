-- Stop retaining clear recipient email hints created before masking was introduced.
UPDATE sent_notes
   SET recipient_email_hint = NULL
 WHERE recipient_email_hint LIKE '%@%';
