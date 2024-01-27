import { DialogServiceUtil } from '../dialogs';

export function Confirmable(dialogTitle: string, confirmButton: string = 'Confirm', cancelButton: boolean = true) {
	return function (target: any, key: string | symbol, descriptor: PropertyDescriptor) {
		const original = descriptor.value;
		descriptor.value = function (...args: any[]) {
			DialogServiceUtil.showConfirmDialog(dialogTitle, confirmButton, cancelButton).then((result) =>
				result ? original.apply(this, args) : null
			);
		};
	};
}
