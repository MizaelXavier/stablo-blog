import { DefaultDocumentNodeResolver } from 'sanity/desk';
import { Preview } from 'sanity';

export const PreviewPane: DefaultDocumentNodeResolver = (S) => {
  return S.document().views([
    S.view.form(),
    S.view.component(Preview).title('Preview')
  ]);
}; 