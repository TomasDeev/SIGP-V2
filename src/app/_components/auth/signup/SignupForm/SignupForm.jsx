import {
  JumboForm,
  JumboInput,
  JumboOutlinedInput,
} from "@jumbo/vendors/react-hook-form";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import LoadingButton from "@mui/lab/LoadingButton";
import { IconButton, InputAdornment, Stack } from "@mui/material";
import React from "react";
import { validationSchema } from "../validation";
import { supabase } from "@app/_config/supabase";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const SignupForm = () => {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleSignup = async (data) => {
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (authData.user) {
        enqueueSnackbar("¡Registro exitoso! Revisa tu email para confirmar tu cuenta.", {
          variant: "success",
        });
        navigate("/auth/login-1");
      }
    } catch (error) {
      console.error("Signup error:", error);
      let errorMessage = "Error en el registro";
      
      if (error.message.includes("User already registered")) {
        errorMessage = "Este email ya está registrado";
      } else if (error.message.includes("Password should be at least")) {
        errorMessage = "La contraseña debe tener al menos 6 caracteres";
      } else if (error.message.includes("Invalid email")) {
        errorMessage = "Email inválido";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <JumboForm
      validationSchema={validationSchema}
      onSubmit={handleSignup}
      onChange={() => {}}
    >
      <Stack spacing={3} mb={3}>
        <JumboInput 
          fieldName={"name"} 
          label={"Nombre"} 
          placeholder="Ingresa tu nombre completo"
        />
        <JumboInput
          fullWidth
          fieldName={"email"}
          label={"Email"}
          placeholder="Ingresa tu email"
        />
        <JumboOutlinedInput
          fieldName={"password"}
          label={"Contraseña"}
          type={values.showPassword ? "text" : "password"}
          margin="none"
          placeholder="Ingresa tu contraseña (mínimo 6 caracteres)"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={handleClickShowPassword}
                edge="end"
              >
                {values.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
          sx={{ bgcolor: (theme) => theme.palette.background.paper }}
        />
        <LoadingButton
          fullWidth
          type="submit"
          variant="contained"
          size="large"
          loading={loading}
        >
          Registrarse
        </LoadingButton>
      </Stack>
    </JumboForm>
  );
};

export { SignupForm };
