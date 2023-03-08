export interface ExportButtonProps {
  exportFunction(): any;
}

export interface LoadButtonProps {
  loadFunction(event: any): any;
}

export interface SaveButtonProps {
  saveFunction(): any;
}

export interface ShowConfigToggleButtonProps {
  onShowConfigToggle(event: any): any;
}
