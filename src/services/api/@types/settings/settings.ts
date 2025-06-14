export interface SettingsType {
  id: number
  club_id: number
  tax_calculation: number
  loyalty_enabled: number
}

export interface SettingsTypeResponse {
  data: SettingsType
}
