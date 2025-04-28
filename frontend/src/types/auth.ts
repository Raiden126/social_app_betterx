export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface VerifyOtpFormData extends React.ComponentProps<"div"> {
  email: string;
}

export interface ForgotPasswordFormProps extends React.ComponentProps<"div"> {
  onBack: () => void;
}