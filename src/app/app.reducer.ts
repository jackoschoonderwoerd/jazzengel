import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromUI from './shared/ui.reducer';
import * as fromAuth from './auth/auth.reducer';
import * as fromProgram from './program/program.reducer'


export interface GlobalState {
  ui: fromUI.UIState,
  auth: fromAuth.AuthState,
  program: fromProgram.ProgramState
  
}

export const reducers: ActionReducerMap<GlobalState> = {
  ui: fromUI.uiReducer,
  auth: fromAuth.authReducer,
  program: fromProgram.programReducer
  
}

export const getProgramState = createFeatureSelector<fromProgram.ProgramState>('program');
export const getYears = createSelector(getProgramState, fromProgram.getYears);
export const getDate = createSelector(getProgramState, fromProgram.getDate);
export const isShowcaseOpen = createSelector(getProgramState, fromProgram.isShowcaseOpen);
export const getSelectedArtistId = createSelector(getProgramState, fromProgram.getSelectedArtistId);
export const getArtist = createSelector(getProgramState, fromProgram.getArtist);
export const getBooking = createSelector(getProgramState, fromProgram.getBooking);

export const getUiState = createFeatureSelector<fromUI.UIState>('ui');
export const getIsLoading  = createSelector(getUiState, fromUI.getIsLoading)

export const getAuthState = createFeatureSelector<fromAuth.AuthState>('auth');
export const getIsAuth = createSelector(getAuthState, fromAuth.getIsAuth)
export const getUserEmail = createSelector(getAuthState, fromAuth.getUserEmail);
export const getIsAdmin = createSelector(getAuthState, fromAuth.getIsAdmin);


