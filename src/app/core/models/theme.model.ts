export interface ThemeBase {
  name_theme: string;
  status?: boolean;
}

export interface ThemeCreate extends ThemeBase {}

export interface ThemeUpdate extends ThemeBase {}

export interface ThemeResponse extends ThemeBase {
  id_theme: number;
}
