export const TOAST_MESSAGES = {
  auth: {
    loginSuccess: "Successfully signed in",
    loginError: "Failed to sign in",
    registerSuccess: "Account created successfully",
    registerError: "Failed to create account",
    resetPasswordSuccess: "Password reset link sent",
    resetPasswordError: "Failed to send reset link",
  },
  settings: {
    saveSuccess: "Settings saved successfully",
    saveError: "Failed to save settings",
    deleteSuccess: "Organization deleted successfully",
    deleteError: "Failed to delete organization",
  },
  team: {
    inviteSuccess: "Member invited successfully",
    inviteError: "Failed to invite member",
    removeSuccess: "Member removed successfully",
    removeError: "Failed to remove member",
  },
  domains: {
    addSuccess: "Domain added successfully",
    addError: "Failed to add domain",
    deleteSuccess: "Domain deleted successfully",
    deleteError: "Failed to delete domain",
  },
} as const