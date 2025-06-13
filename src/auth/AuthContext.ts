import type {
  AuthResult,
  SignInCredential,
  SignUpCredential,
} from '@/services/api/@types/auth'
import { UserClubListData } from '@/services/api/@types/club'
import { MeData } from '@/services/api/@types/user'
import { createContext } from 'react'
import type { SetManualDataProps } from './AuthProvider'

type Auth = {
  authenticated: boolean
  authDashboard: boolean
  user: MeData
  signIn: (values: SignInCredential) => AuthResult
  setClubData: (data: UserClubListData) => AuthResult
  signUp: (values: SignUpCredential) => AuthResult
  signOut: () => void
  setManualDataClub: (data: SetManualDataProps) => void
  // oAuthSignIn: (
  //     callback: (payload: OauthSignInCallbackPayload) => void,
  // ) => void
}

const defaultFunctionPlaceHolder = async (): AuthResult => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  return { status: '', message: '' }
}

// const defaultOAuthSignInPlaceHolder = (
//     callback: (payload: OauthSignInCallbackPayload) => void,
// ): void => {
//     callback({
//         onSignIn: () => {},
//         redirect: () => {},
//     })
// }

const AuthContext = createContext<Auth>({
  authenticated: false,
  authDashboard: false,
  user: {},
  signIn: async () => defaultFunctionPlaceHolder(),
  setClubData: async () => defaultFunctionPlaceHolder(),
  signUp: async () => defaultFunctionPlaceHolder(),
  signOut: () => {},
  setManualDataClub: async () => defaultFunctionPlaceHolder(),
  // oAuthSignIn: defaultOAuthSignInPlaceHolder,
})

export default AuthContext
