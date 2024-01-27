import {
	Directive,
	EmbeddedViewRef,
	inject,
	Input,
	SimpleChange,
	SimpleChanges,
	TemplateRef,
	ViewContainerRef,
} from '@angular/core';

interface EmbeddedViewChange {
	inPreviousRange: boolean;
	inRange: boolean;
	index: number;
	view: EmbeddedViewRef<Context> | null;
}

interface Context {
	index: number;
	even: boolean;
	odd: boolean;
	first: boolean;
	last: boolean;
}

@Directive({
	selector: '[ngRange]',
	standalone: true,
})
export class RangeDirective {
	@Input() ngRange: number = 0;
	@Input() ngRangeMin: number = 0;
	@Input() ngRangeStep: number = 1;

	// Access template
	private readonly templateRef = inject(TemplateRef<unknown>);
	// Inject template into parent view
	private readonly viewContainer = inject(ViewContainerRef);

	getPreviousValue(change?: SimpleChange): number | null {
		const DEFAULT_PREVIOUS_VALUE = 0;

		// Property didn't change, just pass existing value
		if (!change) {
			return null;
		}

		// Value has been initialized or changed
		return change.firstChange ? DEFAULT_PREVIOUS_VALUE : change.previousValue;
	}

	getViewChanges(previousMin: number, min: number, previousMax: number, max: number): EmbeddedViewChange[] {
		const viewChanges: EmbeddedViewChange[] = [];

		for (let i = Math.min(previousMin, min); i < Math.max(previousMax, max); i++) {
			const inPreviousRange = i >= previousMin && i < previousMax;
			const inRange = i >= min && i < max;

			viewChanges.push({
				index: i,
				inPreviousRange,
				inRange,
				view: inPreviousRange ? (this.viewContainer.get(i - previousMin) as EmbeddedViewRef<Context>) : null,
			});
		}

		return viewChanges;
	}

	applyViewChanges(viewChanges: EmbeddedViewChange[], previousMin: number, min: number, max: number): void {
		viewChanges.forEach((viewChange) => {
			// Not in current range -> Remove from parent view
			if (!viewChange.inRange) {
				// Check if we should remove from the beginning or at the end
				if (viewChange.index < min) {
					this.viewContainer.remove(0);
				} else {
					this.viewContainer.remove();
				}

				return;
			}

			const context = this.getContext(viewChange.index, min, max);

			if (viewChange.inRange && viewChange.inPreviousRange) {
				this.applyContextChange(viewChange.view!, context);
				return;
			}

			// Wasn't in previous range -> Add to parent view
			if (!viewChange.inPreviousRange) {
				if (viewChange.index < previousMin) {
					this.viewContainer.createEmbeddedView(this.templateRef, context, {
						index: viewChange.index - min,
					});
				} else {
					this.viewContainer.createEmbeddedView(this.templateRef, context);
				}
			}
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const previousMin = this.getPreviousValue(changes['ngRangeMin']) ?? this.ngRangeMin;
		const min = this.ngRangeMin;

		const previousMax = this.getPreviousValue(changes['ngRange']) ?? this.ngRange;
		const max = this.ngRange;

		const viewChanges = this.getViewChanges(previousMin, min, previousMax, max);

		this.applyViewChanges(viewChanges, previousMin, min, max);
	}

	applyContextChange(view: EmbeddedViewRef<Context>, context: Context) {
		view.context = context;
	}

	getContext(index: number, min: number, max: number): Context {
		const displayIndex = index * this.ngRangeStep;

		return {
			index: displayIndex,
			even: !(displayIndex % 2),
			odd: !!(displayIndex % 2),
			first: index === min,
			last: index === max - 1,
		};
	}

	static ngTemplateContextGuard(_: RangeDirective, context: Context): context is Context {
		return true;
	}
}
