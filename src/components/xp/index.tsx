import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import BgNoise from '@/components/bg-noise';

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
          As a full-stack staff engineer, I’m often filling a gap on a team, developing new internal tools or identifying upcoming challenges. Lately, it’s meant growing a team of new engineers, and focussing server-side on scaling through database/infrastructure redesigns and code refactors.
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
