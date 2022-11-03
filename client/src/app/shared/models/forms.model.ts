import { FormControl, FormGroup } from '@angular/forms';

// source: https://stackoverflow.com/questions/72507263/angular-14-strictly-typed-reactive-forms-how-to-type-formgroup-model-using-exi
export type ModelFormGroup<T> = FormGroup<{
	[K in keyof T]: FormControl<T[K]>;
}>;
