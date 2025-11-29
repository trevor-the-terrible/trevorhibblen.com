import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function Xp() {
  return (
    <Card
        id="xp"
        className="
          text-pretty subpixel-antialiased
          my-6
          relative
        "
      >
        <CardHeader>
          <CardTitle>
            Experience
          </CardTitle>
        </CardHeader>

        <CardContent
          className="prose dark:prose-invert"
        >
          <p>
          An experienced full-stack developer. I’ve successfully managed and developed complete platforms and feature-sets from zero to production
across a range of technologies. I value good design fundamentals, understanding the customer and product, and being an uplifting force to
those around me. Quite comfortable in fast-paced environments and good taking on multiple roles, from gathering requirements, all aspects of
design and development, to addressing stakeholder feedback and customer support. Also, kinda fun to work with 🎉
          </p>

          <h4>About this site</h4>
          <p>
            Developed in Astro, with React components.

            Most of the sections were fairly easy to implement.

            The most challenging portion was the Feedback form.

            <h5 className="m-0">Technologies used</h5>
            <ul className="tracking-tight mt-0">
              <li className="m-0 p-0">
                <a href="https://astro.build/" target="astro.build">Astro</a>
              </li>
              <li className="m-0 p-0">
                <a href="https://react.dev/" target="react.dev">React</a>
              </li>
              <li className="m-0 p-0">
                <a href="https://tailwindcss.com/" target="tailwindcss.com">Tailwind</a>
              </li>
              <li className="m-0 p-0">
                <a href="https://ui.shadcn.com/" target="_blank">Shadcn</a>
              </li>
            </ul>
          </p>
        </CardContent>
    </Card>
  )
}
