import { captureException } from '@sentry/browser';
import { buildPurpose } from '@/constants';

// eslint-disable-next-line import/prefer-default-export
export function captureProductionException(error) {
  if (buildPurpose === 'stage' || buildPurpose === 'release') {
    captureException(error);
  }
}
