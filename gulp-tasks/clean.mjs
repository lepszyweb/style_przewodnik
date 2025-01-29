import { deleteAsync } from 'del';

export async function styleguide() {
  return deleteAsync(['./dist/style-guide/*'], { force: true });
}

export async function css() {
  return deleteAsync(['./dist/css/*'], { force: true });
}

export async function js() {
  return deleteAsync(['./dist/js/*'], { force: true });
}

export async function docs() {
  return deleteAsync([
    './docs/style-guide/',
    './docs/css/',
    './docs/assets/',
    './docs/all/',
    './docs/js/'
  ], { force: true });
}
