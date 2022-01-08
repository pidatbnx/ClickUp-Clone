import React from "react";
import createSection from "../containers/Card";
import SignUp from "../components/SignUp";

const SignUpSection = createSection(SignUp);

function SignInPage() {
  return (
    <SignUpSection />
  );
}

export default SignInPage;
