import { trigger, state, style, animate, transition } from '@angular/animations';

export const flyInOut = trigger('flyInOut', [
  state('in', style({ transform: 'translateX(0)' })),
  transition('void => *', [
    style({ transform: 'translateX(-100%)' }),
    animate(300)
  ]),
  transition('* => void', [
    animate(300, style({ transform: 'translateX(100%)' }))
  ])
]);