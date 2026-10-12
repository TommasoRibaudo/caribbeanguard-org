import type { ButtonData, ListItem, ListLayout, Theme } from "@/lib/content-types";
import ButtonBlock from "./ButtonBlock";
import ImageBlock from "./ImageBlock";

type ListSectionProps = {
  theme?: Theme;
  title?: string;
  headingLevel?: 1 | 2;
  layout: ListLayout;
  items: ListItem[];
  sectionButton?: ButtonData | null;
};

export default function ListSection({ theme = "white", title, headingLevel = 2, items, sectionButton }: ListSectionProps) {
  const Heading = headingLevel === 1 ? "h1" : "h2";
  const ItemHeading = headingLevel === 1 ? "h2" : "h3";
  return (
    <section className={`theme-${theme} bg-background text-foreground`}>
      <div className="page-width content-section">
        {title && <Heading className="list-heading">{title.replace(/<[^>]*>/g, "")}</Heading>}
        <div className="readable-list">
          {items.map((item) => (
            <article className="readable-item" key={item.title}>
              {item.image && <ImageBlock url={item.image.url} alt={item.title} className="aspect-[4/3] rounded-lg" />}
              <ItemHeading className="list-item-heading">{item.title}</ItemHeading>
              {item.descriptionHtml.length > 600 ? (
                <details>
                  <summary>Leer información completa</summary>
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
                </details>
              ) : <div className="rich-text-compact item-summary" dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />}
              {item.button?.text && item.button.link && (
                <ButtonBlock text={item.button.text} link={item.button.link} variant="outline" className="mt-5" />
              )}
            </article>
          ))}
        </div>
        {sectionButton?.text && sectionButton.link && (
          <div className="mt-10"><ButtonBlock text={sectionButton.text} link={sectionButton.link} /></div>
        )}
      </div>
    </section>
  );
}
