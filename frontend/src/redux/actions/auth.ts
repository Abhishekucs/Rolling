import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Auth } from "@/init/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Rolling from "@/init/api";
import { UserState } from "../slices/auth";
import { FirebaseError } from "firebase/app";

const CREATE_USER = "user/createUser";
// const SIGN_IN = "user/signIn";
//const SIGN_OUT = "user/signOut";
//const GET_USER = "user/getUser";

export const signUp = createAsyncThunk<
  NonNullable<unknown>,
  { name: string; password: string; email: string },
  { state: UserState; rejectValue: string }
>(CREATE_USER, async ({ name, password, email }, thunkAPI) => {
  if (Auth === undefined) {
    return thunkAPI.rejectWithValue("Auth is not initialized");
  }
  //TODO: check connection state here

  let createdAuthUser;
  try {
    createdAuthUser = await createUserWithEmailAndPassword(
      Auth,
      email,
      password,
    );
    const uid = createdAuthUser.user.uid;

    const signUpResponse = await Rolling.users.create(name, email, uid);

    if (signUpResponse.status !== 200) {
      throw signUpResponse.data;
    }

    await updateProfile(createdAuthUser.user, { displayName: name });
    await Rolling.users.sendVerificationEmail();

    thunkAPI.dispatch(
      setUser({
        name: createdAuthUser.user.displayName as string,
        email: createdAuthUser.user.email as string,
        uid: createdAuthUser.user.uid as string,
      }),
    );
    // dispatch setCart action
  } catch (error) {
    if (createdAuthUser) {
      try {
        await Rolling.users.deleteUser();
      } catch (error) {
        // account might already be deleted
      }

      try {
        await createdAuthUser.user.delete();
      } catch (error) {
        // account might already be deleted
      }
    }

    //TODO: add toast for 'failed to create account" message
    if (error instanceof FirebaseError) {
      if (error.code === "auth/email-already-in-use") {
        return thunkAPI.rejectWithValue("Email already in use");
      } else {
        return thunkAPI.rejectWithValue(error.code);
      }
    }
    return thunkAPI.rejectWithValue(error as string);
  }
});

export const setUser = createAction<RollingTypes.User>("user/setUser");
export const clearUser = createAction("user/clearUser");

//export const signIn = createAsyncThunk(SIGN_IN, async () => {});

//export const signOut = createAsyncThunk(SIGN_OUT, async () => {});

export const getDataAndInit = createAsyncThunk(
  "user/getDataAndInit",
  async (_, { rejectWithValue, dispatch }) => {
    if (Auth === undefined) {
      return rejectWithValue("Auth is not initialized");
    }

    Auth.onAuthStateChanged(async function (user) {
      if (user) {
        dispatch(
          setUser({
            name: user.displayName as string,
            uid: user.uid,
            email: user.email as string,
          }),
        );
      }
    });
  },
);
