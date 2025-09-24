-- Arreglar función con search_path seguro
CREATE OR REPLACE FUNCTION get_user_auth_info(user_uuid UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'email_confirmed', CASE WHEN email_confirmed_at IS NOT NULL THEN true ELSE false END,
        'confirmed_at', email_confirmed_at
    )
    INTO result
    FROM auth.users
    WHERE id = user_uuid;
    
    RETURN COALESCE(result, '{"email_confirmed": false}'::json);
END;
$$;