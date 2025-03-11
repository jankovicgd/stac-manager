import { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { getFirstPath } from './validate';

/**
 * Scrolls to the first invalid field according to the formik errors.
 */
export function ScrollToInvalidField() {
  const { errors, isSubmitting, isValidating } = useFormikContext();

  useEffect(() => {
    // Run on submission after validation took place.
    if (!errors || !isSubmitting || isValidating) return;

    const path = getFirstPath(errors);
    // Use the parent node because if the element is a hidden input, it won't
    // scroll.
    const element = document.querySelector(`[name="${path}"]`)
      ?.parentNode as HTMLElement;
    element?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }, [errors, isSubmitting, isValidating]);

  return null;
}
