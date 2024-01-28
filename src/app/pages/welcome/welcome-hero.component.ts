import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { TOP_LEVEL_NAV } from '../../core/models';
import { LoginModalComponent } from '../../modules/user-settings/modals';
import { SCREEN_DIALOGS } from '../../shared/models/layout.model';

@Component({
	selector: 'app-welcome-hero',
	standalone: true,
	imports: [CommonModule, MatButtonModule],
	template: `
		<section class="welcome-full h-[100vh] relative">
			<!-- shape -->
			<div
				class="absolute lg:w-8/12 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-11/12 h-11/12 lg:h-8/12"
			>
				<ng-container *ngTemplateOutlet="shape"></ng-container>
			</div>

			<div class="c-background-shadow">
				<!-- title -->
				<h1 class="mb-10 space-x-2 text-4xl text-center sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl">
					<span class="text-wt-primary-dark">Spend</span>
					<span class="text-white">Mindful</span>
				</h1>

				<!-- description -->
				<!--  <p class="w-10/12 mx-auto mb-8 text-center sm:w-9/12 2xl:w-7/12 welcome-body-1">{{ description }}</p> -->

				<!-- button -->
				<div class="flex justify-center mb-10">
					<button
						class="h-16 text-lg g-button-size-lg"
						type="button"
						mat-stroked-button
						color="primary"
						(click)="onLogin()"
					>
						Launch Application
					</button>
				</div>

				<p class="w-10/12 mx-auto mb-10 text-base text-center sm:w-9/12 2xl:w-7/12 text-wt-gray-medium">
					version: {{ version }}
				</p>
			</div>
		</section>

		<!-- shape -->
		<ng-template #shape>
			<svg class="opacity-25 c-background-image" viewBox="0 0 890 890" fill="none" xmlns="http://www.w3.org/2000/svg">
				<g clip-path="url(#clip0_1437_12515)">
					<path
						d="M455.193 450.672C469.123 473.403 481.469 497.073 496.73 517.282C498.681 519.774 500.284 521.554 502.509 524.232C505.458 527.154 508.575 529.913 511.813 532.487C515.05 534.694 518.286 536.349 521.524 538.003C524.761 539.66 527.997 541.317 531.235 543.522C533.94 544.411 537.025 545.989 538.569 549.146C538.569 568.082 535.482 588.596 544.741 605.953C557.086 626.469 581.778 642.248 603.382 628.047C567.889 618.579 547.827 577.551 572.519 545.989C594.123 520.741 631.16 517.586 658.207 534.535C663.063 537.046 665.722 537.781 668.2 538.295C685.861 529.144 702.357 517.317 716.834 503.8C730.431 491.221 742.377 477.599 752.772 463.142C754.548 461.079 756.325 459.034 758.782 458.724C776.216 473.403 793.191 492.338 816.34 487.605C788.564 471.824 763.872 446.577 768.503 411.861C771.588 389.768 783.933 373.989 799.364 359.786C800.908 356.63 800.908 353.475 801.54 350.976C802.78 345.239 803.876 339.463 804.829 333.655C813.411 281.389 810.497 226.621 798.844 174.979C801.002 181.599 805.318 186.014 809.634 190.427C813.95 194.841 816.107 201.462 818.267 205.877C826.898 247.807 828.517 289.185 823.122 329.46C822.352 335.213 821.437 340.944 820.38 346.652C788.564 369.254 757.7 408.706 780.847 449.734C790.105 465.515 805.538 474.981 822.512 476.561C841.031 476.561 856.462 463.936 867.266 449.734C873.438 471.824 853.377 487.605 836.403 493.918C811.712 503.386 788.565 490.762 768.612 478.531C766.08 478.974 764.657 480.728 763.131 482.314C744.159 508.744 721.799 531.609 693.097 550.147C689.5 552.353 685.964 554.437 682.457 556.409C680.551 557.058 678.234 556.817 674.234 553.733C657.395 536.525 635.79 525.479 611.099 530.212C587.951 534.946 569.432 553.884 569.432 579.131C569.432 591.754 577.149 601.223 586.408 605.957C603.382 615.424 609.556 590.177 623.443 590.177C634.245 591.755 635.789 607.535 631.16 618.581C624.987 632.782 612.643 642.251 597.21 643.83C563.262 646.986 535.483 618.581 530.871 585.948C529.25 578.39 527.43 576.153 525.496 574.98C505.488 567.662 487.355 555.94 472.966 540.766C469.515 537.125 466.277 533.285 463.282 529.26C456.8 503.371 455.26 476.548 455.212 450.659L455.193 450.672Z"
						fill="url(#paint0_linear_1437_12515)"
					/>
					<path
						d="M455.289 450.524C441.342 426.056 428.996 400.809 411.756 377.175C408.388 373.723 404.764 370.501 400.933 367.522C391.356 360.073 380.498 354.142 369.201 349.936C365.521 348.218 361.791 346.694 359.588 336.66C356.469 306.127 337.95 277.722 307.087 271.41C290.111 268.254 273.136 274.567 262.334 288.77C259.247 296.659 254.619 317.173 260.791 312.44C277.767 299.816 302.456 287.191 319.432 307.705C342.58 334.532 325.604 373.982 296.284 386.607C268.508 399.231 243.817 385.028 218.161 377.9C213.942 380.85 209.815 383.957 205.79 387.207C185.663 403.461 168.04 423.322 153.609 445.391C150.501 450.144 147.541 454.998 144.737 459.943C132.709 471.818 134.251 492.333 123.885 506.546C121.934 512.103 120.161 517.603 118.563 523.083C99.3845 588.824 99.9139 658.272 114.713 724.483C112.555 717.861 108.237 713.448 103.922 709.035C99.6059 704.622 97.448 698 95.2901 693.587C83.575 636.681 84.7767 580.791 99.5722 527.296C100.747 525.25 102.33 523.062 106.092 519.18C141.968 484.444 134.251 427.636 94.1286 400.809C109.559 399.231 121.905 411.855 132.306 423.269C140.336 433.723 143.253 429.666 146.195 425.175C160.907 402.724 178.304 382.379 198.543 365.579C202.591 362.219 206.752 359.002 211.028 355.936C233.014 378.717 263.878 396.075 294.741 381.872C316.345 370.826 330.234 345.577 319.432 321.908C313.259 309.284 299.371 301.394 285.482 307.705C283.94 309.284 282.397 314.018 282.397 317.173C285.482 325.065 290.112 336.109 280.853 340.844C260.792 350.312 243.818 328.219 245.36 309.284C248.445 279.302 277.767 260.366 307.087 265.099C334.863 269.832 351.839 293.503 361.974 317.103C366.644 318.35 371.258 319.523 375.845 320.625C400.663 327.247 423.323 340.486 440.588 358.693C444.041 362.336 447.278 366.175 450.274 370.201C458.295 396.106 453.659 424.521 455.263 450.557L455.289 450.524Z"
						fill="url(#paint1_linear_1437_12515)"
					/>
					<path
						d="M455.257 450.705C483.019 456.052 509.252 467.098 536.756 469.152C541.31 469.316 545.867 469.152 550.362 468.672C554.858 468.191 559.294 467.394 563.611 466.291C624.038 448.637 662.885 395.673 673.676 333.882C679.07 303.288 679.116 273.034 674.671 243.823C673.782 237.979 672.713 232.179 671.473 226.426C697.519 224.085 731.47 214.617 736.099 183.057C709.864 208.305 669.742 214.617 643.507 186.213C631.163 172.01 623.446 153.075 624.808 133.86C625.479 120.33 623.992 117.318 622.386 114.47C599.14 80.7456 569.793 51.2575 536.714 27.9233C531.987 24.5896 527.187 21.3822 522.207 18.2011C512.34 11.053 504.623 3.16171 493.821 0.00683594C499.995 0.00683594 503.08 4.7416 509.391 6.56267C513.051 8.40014 515.194 9.14661 516.876 9.54363C525.981 10.9906 534.477 15.5433 544.189 13.8879C575.24 37.9178 604.337 66.287 628.681 98.2163C630.226 100.922 631.706 103.657 630.193 112.13C623.446 142.029 631.162 178.322 660.483 194.103C682.088 205.149 708.321 201.992 723.753 181.478C736.099 165.697 729.927 148.34 728.383 130.982C754.618 140.45 753.075 176.745 740.729 197.259C729.927 214.617 712.953 220.93 694.433 228.819C692.892 230.398 692.892 233.554 693.086 237.37C694.157 243.055 695.061 248.792 695.786 254.58C696.511 260.367 697.056 266.204 697.417 272.089C699.575 316.226 693.102 360.363 675.835 400.086C662.888 430.984 641.306 453.052 615.408 475.119C595.986 488.36 576.562 497.187 552.822 501.602C544.729 502.706 536.637 503.119 528.612 502.809C524.598 502.653 520.598 502.312 516.496 501.644C492.286 490.767 475.311 468.668 455.273 450.704L455.257 450.705Z"
						fill="url(#paint2_linear_1437_12515)"
					/>
					<path
						d="M455.225 450.526C428.995 446.582 404.305 433.958 375.842 431.05C371.266 431.068 366.67 431.423 362.083 432.084C339.153 435.395 316.493 446.429 298.149 461.876C235.564 514.841 224.773 598.7 242.037 675.941C265.776 768.63 326.204 843.659 406.052 890.006C393.103 892.214 382.314 883.386 369.365 885.595C334.836 859.11 302.224 827.726 276.007 791.434C272.729 786.898 269.562 782.116 266.448 777.081C260.784 738.517 233.008 703.802 192.886 703.802C203.688 694.334 217.577 699.067 228.973 700.698C227.619 695.597 226.205 690.276 224.939 684.918C208.771 624.114 210.587 558.348 237.718 499.399C252.825 468.505 272.248 446.436 298.145 424.368C308.936 415.54 321.884 411.127 334.834 404.507C349.402 399.543 365.182 396.749 380.926 396.709C386.174 396.696 391.419 396.99 396.611 397.61C419.746 410.276 436.72 432.374 455.234 450.519L455.225 450.526Z"
						fill="url(#paint3_linear_1437_12515)"
					/>
					<path
						d="M455.321 450.656C476.848 437.108 499.996 424.484 521.883 409.594C524.566 407.264 526.926 404.859 529.084 402.285C542.031 386.837 550.664 371.389 557.139 351.528C558.217 347.85 559.35 344.252 560.486 340.71C589.499 342.428 621.905 323.492 628.078 290.353C631.165 274.572 623.448 249.325 604.93 249.325C608.017 265.106 609.561 279.307 600.3 293.51C586.413 312.446 564.808 312.446 546.289 304.556C504.623 284.042 515.427 236.702 523.744 201.052C520.887 197.059 517.875 193.154 514.715 189.333C505.233 177.874 494.416 167.176 482.438 157.153C477.999 153.442 473.402 149.821 468.653 146.291C469.13 134.129 484.562 132.551 487.649 123.083C459.873 132.551 429.008 135.707 403.193 116.522C395.638 110.56 390.644 106.298 387.342 104.526C323.105 82.5289 254.041 82.2319 188.095 102.154C198.886 93.3273 205.36 84.4992 218.309 80.0844C271.028 68.7347 322.858 70.1538 372.646 82.5814C375.587 83.633 378.467 84.6452 381.462 85.938C396.598 108.88 421.289 129.394 450.609 126.238C487.646 123.081 501.533 86.7879 504.62 53.6494C526.225 82.0531 506.164 113.613 491.878 138.787C495.456 142.079 499.202 145.393 502.911 148.773C515.275 160.036 526.704 172.258 537.664 184.96C539.854 187.499 542.028 190.059 544.186 192.633C526.225 209.874 515.422 233.544 520.051 260.37C523.138 277.727 533.94 290.352 549.371 298.241C560.173 302.974 570.975 301.398 581.778 296.663C591.036 291.928 598.752 276.149 589.495 269.836C578.692 263.525 558.631 257.212 572.519 239.854C591.038 219.34 621.9 233.543 631.16 255.635C648.134 291.93 621.901 329.801 589.068 343.386C587.494 346.212 586.511 348.88 585.731 351.526C585.012 356.676 584.112 361.824 583.032 366.974C575.838 392.72 564.147 415.403 545.464 433.742C541.729 437.408 537.71 440.903 533.396 444.214C507.71 449.726 481.479 451.301 455.327 450.645L455.321 450.656Z"
						fill="url(#paint4_linear_1437_12515)"
					/>
					<path
						d="M455.177 450.558C430.548 465.515 405.858 479.718 383.047 499.307C379.57 503.272 376.331 507.523 373.334 511.977C370.337 516.433 367.579 521.091 365.062 525.873C362.545 530.655 360.446 535.497 358.717 540.392C357.475 542.728 356.514 545.132 354.395 547.34C334.871 553.886 311.723 555.463 297.834 574.4C288.575 588.601 282.403 607.537 290.119 623.318C294.749 631.209 300.921 640.675 311.723 639.097C305.551 613.848 317.897 583.866 345.673 583.866C391.967 583.866 408.943 642.254 388.672 678.604C386.124 684.75 385.82 688.489 385.373 692.363C397.754 710.727 413.15 727.281 431.127 742.314C435.465 746.058 439.961 749.706 438.135 755.544C415.115 770.071 399.685 803.211 413.572 826.88C412.029 789.007 447.522 755.87 484.559 762.18C504.62 765.336 523.138 776.382 534.638 792.895C537.758 796.501 539.692 798.132 541.729 799.781C601.49 816.008 664.801 813.619 725.462 799.52C718.987 801.728 714.669 806.14 710.354 810.554C708.196 812.761 703.88 812.761 701.722 814.968C699.563 817.174 697.406 821.588 695.248 821.588C645.457 829.626 596.461 829.531 549.226 819.325C546.156 817.348 543.141 815.612 536.991 803.744C520.045 771.649 481.466 755.868 449.057 773.226C427.453 784.272 416.651 809.521 424.366 833.191C430.54 850.549 445.971 856.862 461.403 864.75C444.427 878.953 418.194 860.017 408.935 844.236C395.046 817.409 402.762 787.427 419.866 763.906C419.308 760.736 417.966 758.239 416.107 756.139C399.84 742.65 385.224 727.473 372.609 710.726C369.455 706.539 366.835 702.076 371.934 693.289C393.504 669.076 401.22 629.626 376.529 604.379C362.64 590.176 334.863 587.02 325.604 607.534C322.517 618.58 334.863 621.736 341.037 628.049C342.58 631.206 344.123 635.939 344.123 639.094C342.58 653.297 328.691 658.03 317.889 658.03C300.913 658.03 288.569 645.407 282.395 629.626C268.506 593.331 294.741 558.614 327.157 545.596C328.749 540.223 330.292 534.978 331.778 529.853C337.72 509.354 347.327 490.262 360.381 474.498C364.006 470.119 367.897 465.996 372.051 462.17C396.614 448.159 427.466 451.309 455.189 450.555L455.177 450.558Z"
						fill="url(#paint5_linear_1437_12515)"
					/>
					<path
						d="M455.337 450.591C461.405 424.481 470.663 399.233 474.139 373.1C474.609 367.217 474.519 361.7 474.001 356.264C469.844 312.782 439.15 270.607 401.743 250.009C346.947 220.7 288.2 216.983 232.834 231.095C227.298 232.506 222.061 233.83 222.587 227.938C220.672 224.073 225.3 214.604 222.215 217.76C203.697 239.852 182.093 257.21 153.593 264.621C148.326 267.672 143.275 270.809 138.409 274.08C99.471 300.254 65.5145 334.86 40.2889 373.924C38.1086 376.813 36.116 379.643 28.277 385.925C13.8986 399.23 0.00955793 418.163 0.00955793 438.686C-1.53385 413.438 18.5272 399.237 28.4021 379.113C30.021 373.044 31.6398 366.976 30.56 360.354C54.2999 327.252 81.8165 296.908 113.379 271.805C117.889 268.217 122.479 264.739 127.153 261.374C155.871 258.792 188.278 255.635 206.796 225.653C223.77 198.826 208.337 173.579 202.165 148.33C226.857 157.798 233.029 186.202 234.367 210.307C238.694 209.633 243.143 208.812 247.685 207.869C284.009 200.312 320.611 199.254 358.595 208.081C388.808 214.702 412.547 225.735 438.444 243.39C466.5 265.459 488.082 291.94 501.029 325.044C505.884 339.94 508.313 355.767 508.201 371.594C508.164 376.87 507.842 382.147 507.234 387.387C498.458 413.423 472.226 430.78 455.348 450.566L455.337 450.591Z"
						fill="url(#paint6_linear_1437_12515)"
					/>
					<path
						d="M455.144 450.624C450.599 478.145 441.34 504.971 439.43 532.498C439.42 537.177 439.723 541.877 440.317 546.568C443.285 570.014 453.535 593.187 468.64 611.944C516.738 671.373 590.882 685.131 661.711 672.659C664.305 672.674 666.633 674.252 668.52 680.833C669.733 692.757 675.906 703.803 683.622 714.847C694.422 725.894 706.769 735.361 723.744 732.207C725.287 732.207 726.831 727.472 726.831 727.472C694.424 708.536 683.622 665.928 709.856 637.524C729.917 613.854 759.237 617.01 785.741 617.255C790.677 614.011 795.231 610.566 799.648 606.978C834.986 578.292 864.661 542.427 887.321 501.602C889.479 514.844 880.847 525.878 883.005 539.118C862.994 568.007 839.291 594.6 812.725 617.417C808.297 621.218 803.67 624.806 798.7 628.102C763.867 617.012 716.03 618.59 702.139 661.197C697.509 675.399 700.596 691.179 709.856 702.226C723.744 719.584 746.892 705.383 759.237 711.694C774.668 718.007 746.892 738.521 733.003 741.676C697.509 747.989 678.991 716.427 659.92 693.198C654.289 694.22 648.617 695.068 642.907 695.736C614.362 699.076 584.888 697.913 554.969 691.395C524.755 684.774 498.857 675.946 475.117 656.086C457.853 642.845 444.904 629.602 431.955 611.947C415.122 586.791 405.281 558.456 404.762 529.801C404.676 525.025 404.849 520.243 405.455 515.315C415.114 489.18 436.709 471.806 455.143 450.609L455.144 450.624Z"
						fill="url(#paint7_linear_1437_12515)"
					/>
					<path
						d="M455.225 450.689C476.848 467.092 498.451 482.871 521.259 496.629C525.238 498.56 529.335 500.25 533.515 501.699C546.047 506.043 559.297 508.217 572.246 508.217C608.935 506.01 641.306 490.561 669.362 464.078C728.98 405.506 749.341 325.564 741.761 246.699C741.177 240.632 740.427 234.573 739.519 228.529C739.189 224.075 737.646 219.34 739.189 216.184C766.965 186.202 771.594 137.283 736.102 112.035C720.67 100.989 700.609 99.4111 685.178 112.035C675.919 119.927 669.745 132.55 671.289 145.174C674.375 157.798 688.265 162.531 692.895 172.001C697.523 183.047 674.375 183.047 665.118 178.312C655.859 172.001 646.599 164.11 643.512 153.064C635.797 129.393 640.427 102.568 659.923 86.073C668.332 78.0899 673.272 73.0828 674.679 69.5506C672.935 67.1487 671.164 64.7731 669.363 62.4287C672.601 63.5328 675.298 65.1882 677.725 67.1175C677.055 70.0657 676.116 73.2911 669.909 78.6149C660.488 86.785 654.314 96.2546 649.686 105.722C643.512 121.503 640.427 142.017 652.773 157.797C655.859 160.953 662.031 164.108 662.031 160.953C663.575 145.172 662.031 129.393 671.29 116.769C686.723 96.2546 712.957 94.6763 734.562 105.722C768.512 124.658 773.141 171.999 754.83 202.826C753.919 205.837 753.673 207.901 753.27 210.124C762.139 253.329 761.759 294.836 755.69 338.284C749.216 380.214 734.109 415.525 710.37 450.834C695.083 473.824 676.424 493.745 655.174 508.847C650.926 511.867 646.572 514.694 642.12 517.316C592.589 508.117 546.294 545.99 549.38 598.064C540.122 585.44 540.122 568.082 543.513 551.526C547.757 540.325 544.933 538.724 541.259 537.966C529.677 536.309 518.118 533.115 507.152 528.478C502.279 526.418 497.525 524.072 492.94 521.453C475.276 500.208 467.559 474.959 455.205 450.662L455.225 450.689Z"
						fill="url(#paint8_linear_1437_12515)"
					/>
					<path
						d="M455.273 450.509C435.181 435.524 418.207 418.166 396.752 405.017C393.7 403.147 390.48 401.27 387.358 399.531C383.65 398.051 379.814 396.762 375.858 395.659C363.989 392.718 352.298 391.553 340.899 391.94C335.198 392.133 329.618 392.693 324.139 393.612C311.73 392.919 302.471 400.809 292.126 403.372C286.891 405.663 281.755 408.257 276.854 411.107C247.449 428.21 222.631 455.244 205.366 486.14C174.073 543.518 165.98 606.414 174.613 667.377C175.477 673.473 176.327 679.575 177.01 685.692C146.609 703.786 115.746 741.658 138.894 779.531C145.066 790.576 154.326 798.467 166.67 800.045C177.472 801.624 195.99 796.889 191.362 787.421C186.731 777.953 169.757 781.109 165.127 766.907C163.583 759.017 162.04 751.128 165.127 744.815C174.386 729.035 191.362 719.566 209.879 722.722C257.718 733.768 263.89 792.154 240.743 828.449C239.199 830.027 242.286 833.184 243.829 836.34C240.743 834.762 237.656 833.184 237.656 831.606C259.26 795.311 257.717 736.923 209.879 727.457C192.905 724.301 172.844 733.77 171.3 752.706C171.3 757.441 174.387 765.329 180.559 766.907C188.275 768.485 194.448 760.594 200.62 765.329C211.423 774.796 208.336 788.999 199.077 798.467C175.929 820.559 140.437 801.624 131.178 774.796C121.919 746.393 132.722 716.409 155.093 697.139C157.821 694.227 159.122 692.166 160.651 690.053C151.235 639.734 149.901 589.42 162.204 539.102C175.153 489.447 199.027 443.517 235.647 409.691C239.717 405.933 243.942 402.323 248.328 398.875C291.667 403.962 341.048 380.292 339.506 329.796C337.963 309.282 322.53 295.079 308.643 280.878C341.05 282.456 356.48 318.75 356.142 348.978C357 360.071 361.961 360.711 367.093 361.216C377.355 362.227 387.446 364.306 397.124 367.479C402.654 369.291 408.05 371.464 413.266 373.997C439.818 391.371 442.898 424.511 455.284 450.531L455.273 450.509Z"
						fill="url(#paint9_linear_1437_12515)"
					/>
					<path
						d="M455.289 450.689C476.845 446.581 498.448 443.425 519.698 439.999C526.74 438.587 531.489 437.415 536.696 436.06C548.806 431.622 560.194 424.725 570.087 415.531C588.433 398.979 600.3 379.118 607.314 357.602C608.717 353.299 609.926 348.928 610.953 344.507C643.509 310.873 660.485 249.331 611.104 224.082C578.697 206.723 549.376 236.706 544.747 268.266C523.143 255.642 532.403 225.66 544.747 209.881C555.549 195.678 570.982 190.945 584.47 182.658C582.315 178.153 579.761 173.658 576.96 169.23C565.76 151.523 552.475 135.107 537.577 120.143C533.515 116.063 529.331 112.09 525.037 108.228C527.773 80.4819 527.773 50.5 506.168 29.9859C492.279 17.3615 473.762 14.205 456.787 18.9398C445.985 23.6729 436.726 29.9859 433.64 42.6103C432.096 53.6565 433.639 64.7026 442.898 69.4374C453.701 74.1705 461.416 59.9695 470.675 64.7026C483.02 71.014 481.477 89.9514 470.675 99.4193C462.959 107.311 455.244 110.465 445.984 112.044C412.033 115.2 385.8 83.64 384.74 50.0767C384.435 38.184 382.853 34.0185 380.902 30.9818C367.066 27.3249 353.105 24.5522 339.168 22.7131C349.959 18.2983 362.908 18.2983 373.697 13.8851C379.213 15.1106 384.603 16.5937 389.76 18.4295C385.799 48.9217 388.885 85.2167 418.205 100.996C435.18 110.464 466.045 107.309 462.958 88.3715C459.871 77.3254 433.638 83.6384 427.464 64.701C422.834 48.9201 427.464 33.1408 439.81 22.0946C461.414 4.7371 489.192 9.47023 509.254 26.8294C526.228 42.6103 529.315 66.2792 532.454 88.9671C534.487 91.5231 536.587 93.5985 538.639 95.8723C564.715 118.705 587.5 145.724 605.723 176.844C608.325 181.29 610.838 185.818 613.247 190.432C598.757 197.255 578.696 189.363 570.979 206.723C594.126 206.723 617.274 211.457 634.25 230.393C651.224 250.907 654.311 279.311 644.823 304.205C641.592 312.338 641.125 315.42 640.78 318.259C637.635 364.179 620.156 410.457 585.195 444.221C573.055 454.98 559.7 463.565 545.588 469.514C540.884 471.496 536.095 473.185 531.24 474.565C504.655 473.384 479.964 459.176 455.321 450.662L455.289 450.689Z"
						fill="url(#paint10_linear_1437_12515)"
					/>
					<path
						d="M455.193 450.526C425.911 454.468 398.135 457.623 369.691 466.366C364.976 468.532 360.398 471.086 356.013 474.019C351.627 476.951 347.43 480.262 343.475 483.94C323.243 502.146 310.294 524.697 303.149 549.149C301.975 550.995 300.655 552.885 298.42 555.472C265.424 582.287 259.251 642.253 300.916 664.344C328.693 680.124 353.384 658.031 371.902 639.095C387.334 672.233 348.754 699.06 321.253 705.037C323.554 709.716 325.975 714.306 328.513 718.813C341.205 741.339 356.793 761.687 374.603 779.735C378.674 783.861 382.861 787.866 387.154 791.748C388.876 793.739 393.506 796.896 393.506 798.474C393.506 820.566 393.506 845.813 410.48 863.174C425.913 878.954 444.43 885.267 466.035 882.11C489.183 875.797 506.157 855.283 501.527 830.036C498.44 817.411 487.639 806.365 473.75 806.365C461.406 806.365 456.776 822.145 447.516 823.723C436.713 825.301 439.8 807.943 442.887 800.052C449.059 787.428 461.405 779.538 473.75 777.96C518.503 773.225 544.736 822.145 535.479 864.749C535.479 867.906 538.565 869.484 540.272 870.48C545.917 871.797 551.588 872.98 557.277 874.028C562.966 875.075 568.675 875.984 574.394 876.757C563.603 881.17 550.654 881.17 539.865 885.585C535.01 884.663 530.293 883.552 525.843 882.162C533.937 853.703 538.567 817.408 513.876 795.316C499.987 782.693 473.752 774.802 459.865 795.316C483.012 795.316 507.702 811.097 507.702 837.922C506.159 850.547 501.528 861.594 493.813 871.061C481.469 883.685 464.495 888.42 447.519 886.842C413.569 882.107 393.508 850.547 388.879 817.408C388.879 814.252 385.792 812.673 382.324 810.55C377.738 806.964 373.354 803.309 369.152 799.581C339.734 773.483 319.198 743.793 300.314 709.035C297.94 704.402 295.813 699.807 293.952 695.326C304.005 691.167 316.349 697.48 325.607 688.011C282.398 676.966 251.535 631.203 269.186 584.971C271.67 578.388 272.572 574.726 273.558 570.98C273.807 568.454 274.093 565.921 274.417 563.383C280.89 521.452 298.155 483.937 328.369 455.248C340.509 444.49 353.862 436.213 367.974 430.537C373.678 428.936 381.59 428.291 387.604 427.553C411.99 432.458 433.585 440.349 455.148 450.603L455.193 450.526Z"
						fill="url(#paint11_linear_1437_12515)"
					/>
					<path
						d="M455.321 450.64C467.574 432.385 481.463 415.026 494.906 397.699C501.026 388.561 503.617 383.618 505.859 378.746C507.307 374.956 508.567 371.032 509.647 366.986C526.91 294.16 481.589 227.953 421.162 192.639C370.663 163.84 315.792 154.256 261.861 159.065C255.869 159.598 249.887 160.31 243.926 161.192C240.727 160.961 236.096 162.539 234.553 160.961C222.207 143.602 206.776 129.401 186.715 124.666C158.939 119.933 126.532 135.712 124.989 167.272C124.989 178.319 131.162 189.365 140.421 195.676C146.593 198.833 154.31 197.254 157.397 192.52C162.026 181.473 162.026 164.116 177.458 168.849C208.321 178.317 200.606 222.502 177.458 236.704C151.223 254.062 120.36 247.75 97.7015 229.307C92.1616 226.459 88.8165 226.815 85.3735 226.979C82.9012 228.747 80.4497 230.541 78.0223 232.362C80.1802 225.74 84.4959 221.327 88.8133 216.912C106.473 236.703 131.164 247.749 157.399 241.437C172.829 236.704 185.175 225.658 189.805 209.877C191.349 201.986 189.805 186.207 180.546 187.785C171.288 189.361 169.744 203.564 157.399 206.721C134.251 211.455 118.82 189.361 118.82 168.849C120.362 146.757 134.251 130.978 152.77 123.086C179.005 112.04 209.866 124.664 229.031 144.675C234.558 144.288 239.884 143.717 245.063 142.993C286.499 137.202 327.935 137.909 369.372 148.501C417.929 161.742 462.845 186.156 495.924 223.602C499.602 227.763 503.13 232.084 506.502 236.57C504.614 260.373 510.787 285.622 527.762 302.979C550.909 325.072 581.773 323.494 608.007 309.293C600.29 336.12 567.884 337.696 544.474 335.749C544.306 340.328 544.094 345.056 543.887 349.889C543.058 369.215 538.761 388.164 530.831 405.23C529.594 407.896 527.768 410.757 525.783 413.567C506.178 432.401 479.946 440.293 455.335 450.661L455.321 450.64Z"
						fill="url(#paint12_linear_1437_12515)"
					/>
					<path
						d="M455.161 450.59C438.26 474.989 421.286 497.081 407.952 521.739C406.266 526.361 404.9 531.138 403.833 536.011C400.634 550.635 400.129 566.154 401.748 581.049C402.611 586.566 403.711 591.903 404.698 596.006C405.685 600.109 407.684 606.117 409.932 612.774C411.778 617.824 413.859 622.749 416.16 627.545C432.264 661.113 459.154 688.301 492.39 706.84C550.173 740.438 615.691 748.491 678.626 737.703C680.779 738.111 683.299 738.986 687.602 741.511C714.483 759.034 749.975 760.61 773.123 736.94C788.556 721.161 791.642 695.912 779.297 675.398C766.953 658.039 742.261 667.506 734.544 656.462C728.371 645.416 753.062 635.946 766.951 635.946C790.099 639.103 810.16 654.884 820.916 676.981C825.881 674.126 830.776 670.866 835.524 667.116C833.364 673.736 829.048 678.151 824.731 682.562C820.959 681.709 820.959 688.021 819.416 686.442C810.157 665.928 794.724 645.414 771.578 646.992C774.665 664.35 793.183 672.241 793.183 691.177C794.726 716.426 782.382 741.673 760.777 752.721C743.802 760.61 723.74 762.189 707.146 755.946C699.211 753.197 695.5 753.034 691.708 752.773C621.102 768.126 552.578 760.907 488.065 731.116C477.272 724.494 466.483 717.873 455.692 711.253C442.204 701.322 429.93 690.288 419.139 678.289C415.542 674.289 412.11 670.182 408.853 665.971C405.847 662.773 402.76 659.617 404.304 654.884C408.934 635.946 402.76 617.011 391.958 599.653C373.44 569.671 334.86 566.515 305.54 583.872C311.712 550.735 348.749 561.78 369.367 547.948C369.569 544.017 369.941 540.084 370.482 536.17C372.102 524.427 375.227 512.829 379.761 501.821C381.776 496.93 384.069 492.154 386.631 487.533C405.868 468.699 432.099 460.807 455.17 450.619L455.161 450.59Z"
						fill="url(#paint13_linear_1437_12515)"
					/>
					<path
						d="M455.321 450.557C453.689 424.485 449.061 396.08 443.984 369.6C442.998 366.211 441.948 363.145 440.91 360.846C426.364 328.663 395.171 303.988 360.612 293.395C357.942 292.277 355.138 290.99 348.81 284.056C331.779 263.528 305.546 254.058 279.312 260.371C259.251 266.682 242.276 280.885 237.646 302.977C229.931 337.694 257.707 359.786 287.027 364.521C280.855 375.567 266.966 375.567 256.164 373.989C226.844 367.678 209.868 337.694 206.322 309.835C201.18 312.452 196.131 315.261 191.179 318.248C166.41 333.189 144.039 352.632 124.512 375.133C120.605 379.633 116.588 384.082 112.426 388.464C77.1575 377.146 30.8617 385.035 18.5161 427.642C12.3424 449.734 21.6013 473.404 44.7491 479.717C54.008 481.294 72.5257 474.981 66.3536 467.093C57.0948 456.049 40.1189 440.266 57.0948 427.643C77.1559 411.862 104.934 422.908 114.193 445.002C132.71 493.92 86.4163 530.213 45.0139 535.275C43.7384 541.064 42.6121 546.862 41.6383 552.657C40.6644 558.451 39.8446 564.238 39.1804 570.008C37.0225 564.492 35.9427 558.422 34.8646 552.353C33.7865 546.286 32.7067 540.216 30.5488 534.697C32.4051 533.368 32.4051 528.635 33.9485 528.635C61.725 527.059 92.5899 522.324 108.021 493.92C117.28 478.139 117.28 457.625 106.479 441.846C100.305 432.378 92.5899 427.643 81.7877 426.065C72.5289 424.487 58.6398 432.376 63.27 441.846C66.3568 448.157 77.1591 449.735 80.2459 459.203C81.7893 473.406 72.5289 482.874 60.1848 486.03C43.2106 489.187 26.2347 481.296 18.5193 465.516C9.26043 446.581 10.8022 422.91 24.6913 405.553C40.1237 385.038 64.8134 378.725 89.1694 380.202C94.2344 380.453 96.8062 380.074 99.3973 379.692C100.888 377.654 102.397 375.623 103.926 373.6C129.42 339.807 160.696 312.352 195.766 293.08C200.778 290.327 205.863 287.741 211.023 285.326C212.958 282.467 216.043 284.045 216.043 285.623C219.13 299.826 211.413 317.183 223.759 328.229C223.759 279.31 271.596 239.86 317.785 256.388C328.551 260.427 333.246 261.836 336.751 262.384C339.705 262.624 342.667 262.912 345.633 263.259C386.638 269.878 423.325 287.533 451.381 318.43C461.902 330.016 469.996 343.464 475.547 357.96C477.397 362.792 478.966 367.74 480.248 372.773C478.419 400.828 464.525 426.076 455.348 450.571L455.321 450.557Z"
						fill="url(#paint14_linear_1437_12515)"
					/>
					<path
						d="M455.16 450.656C459.86 474.987 462.946 497.081 467.952 521.469C469.05 525.649 470.224 529.514 471.812 535.015C481.554 558.336 500.024 577.7 522.406 591.491C525.031 593.937 527.676 596.1 531.453 604.227C544.733 635.946 581.77 659.617 615.72 645.414C637.324 635.946 649.668 610.698 641.954 587.027C632.695 566.513 606.461 571.248 592.572 566.513C581.771 561.778 603.374 544.421 615.721 541.264C645.04 534.951 669.731 557.043 680.374 582.868C683.504 590.505 686.189 592.746 688.749 595.502C727.981 578.696 762.417 551.908 790.742 518.978C794.519 514.585 798.485 510.209 802.631 505.788C833.308 508.124 868.8 498.656 881.146 465.518C888.863 445.004 885.776 422.911 870.343 407.13C853.369 391.351 824.049 394.506 816.334 418.177C813.247 432.378 830.221 438.691 831.764 448.159C833.308 457.626 817.877 459.205 808.617 456.05C797.814 451.315 791.642 443.425 787.012 432.378C774.666 391.35 814.789 355.055 853.38 358.109C863.72 358.492 866.648 356.62 870.155 355.087C871.882 346.568 873.29 338.015 874.37 329.463C875.448 336.084 876.528 342.151 877.877 348.222C879.227 354.29 880.845 360.359 883.002 366.98C856.454 359.789 827.134 359.789 805.53 378.727C790.099 392.929 780.838 426.066 803.986 438.691C805.53 424.488 805.53 408.709 819.417 399.241C833.306 389.773 850.281 388.195 864.171 396.084C885.776 408.709 893.491 433.956 888.863 457.626C881.146 489.187 853.369 504.966 824.638 510.956C821.946 512.147 820.474 513.266 818.491 514.365C790.298 553.546 754.175 586.807 710.354 609.733C705.574 612.256 700.719 614.63 695.799 616.853C690.876 619.074 685.887 621.145 680.846 623.051C674.363 601.226 675.906 568.088 646.586 561.775C657.388 588.602 658.932 623.319 634.242 643.833C606.466 665.925 566.343 659.612 542.554 634.849C537.975 631.177 534.85 629.509 531.657 627.663C518.921 623.16 506.491 617.221 494.545 609.731C469.725 594.285 450.843 572.217 439.783 546.837C437.57 541.761 435.671 536.552 434.1 531.238C432.014 503.414 445.908 476.59 455.085 450.685L455.16 450.656Z"
						fill="url(#paint15_linear_1437_12515)"
					/>
				</g>
				<defs>
					<linearGradient
						id="paint0_linear_1437_12515"
						x1="661.803"
						y1="643.838"
						x2="661.803"
						y2="174.988"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_1437_12515"
						x1="271.396"
						y1="264.415"
						x2="271.396"
						y2="724.488"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint2_linear_1437_12515"
						x1="695.803"
						y1="395.158"
						x2="395.026"
						y2="101.022"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint3_linear_1437_12515"
						x1="233.357"
						y1="488.676"
						x2="522.257"
						y2="771.198"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint4_linear_1437_12515"
						x1="636.352"
						y1="252.16"
						x2="188.09"
						y2="252.16"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint5_linear_1437_12515"
						x1="278.984"
						y1="660.154"
						x2="725.465"
						y2="660.154"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint6_linear_1437_12515"
						x1="412.486"
						y1="214.023"
						x2="89.337"
						y2="530.036"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint7_linear_1437_12515"
						x1="506.344"
						y1="691.289"
						x2="795.917"
						y2="408.11"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint8_linear_1437_12515"
						x1="704.652"
						y1="532.309"
						x2="530.528"
						y2="121.228"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint9_linear_1437_12515"
						x1="181.217"
						y1="334.825"
						x2="370.857"
						y2="782.538"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint10_linear_1437_12515"
						x1="655.522"
						y1="310.329"
						x2="283.685"
						y2="159.707"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint11_linear_1437_12515"
						x1="258.148"
						y1="587.929"
						x2="630.313"
						y2="738.684"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint12_linear_1437_12515"
						x1="555.817"
						y1="180.38"
						x2="127.291"
						y2="353.965"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint13_linear_1437_12515"
						x1="355.987"
						y1="708.401"
						x2="782.305"
						y2="535.71"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint14_linear_1437_12515"
						x1="313.656"
						y1="243.234"
						x2="154.552"
						y2="618.855"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<linearGradient
						id="paint15_linear_1437_12515"
						x1="588.704"
						y1="660.71"
						x2="751.118"
						y2="277.274"
						gradientUnits="userSpaceOnUse"
					>
						<stop stop-color="#059E9E" />
						<stop offset="1" stop-color="white" />
					</linearGradient>
					<clipPath id="clip0_1437_12515">
						<rect width="890" height="890" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</ng-template>
	`,
	styles: [
		`
			:host {
				display: block;
				overflow: hidden;
				position: relative;
			}

			.c-background-image {
				animation: rotation 60s infinite linear;
			}

			@keyframes rotation {
				from {
					transform: rotate(0deg);
				}
				to {
					transform: rotate(359deg);
				}
			}

			.c-background-shadow {
				width: 100%;
				height: 100%;
				background-color: #00000054;
				color: white;
				position: relative;

				display: grid;
				place-content: center;
			}
		`,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeHeroComponent {
	private dialog = inject(MatDialog);
	private router = inject(Router);

	version = environment.version;
	description = 'Gain control of your wealth by having an oversight of your finances from one place';

	onLogin() {
		this.dialog
			.open(LoginModalComponent, {
				panelClass: [SCREEN_DIALOGS.DIALOG_SMALL],
			})
			.afterClosed()
			.subscribe((res: boolean) => {
				if (res) {
					this.router.navigate([TOP_LEVEL_NAV.dashboard]);
				}
			});
	}
}
