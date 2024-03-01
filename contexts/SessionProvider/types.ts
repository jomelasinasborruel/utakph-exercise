interface AuthContextProps {
  setSession: React.Dispatch<
    React.SetStateAction<
      | {
          email: string | null | undefined;
          uid: string | null;
          displayName: string | null;
        }
      | undefined
      | null
    >
  >;
  session:
    | {
        email: string | null | undefined;
        uid: string | null;
        displayName: string | null;
      }
    | undefined
    | null;
  login: (email: string, password: string) => void;
  logout: () => void;
  createAccount: (email: string, password: string) => Promise<void>;
}
