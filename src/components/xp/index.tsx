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
            A lifelong "full stack" developer. I’m happiest when I can fill a gap on a team or resolving ongoing problems within a system. Lately, that’s meant my focus has been server-side with an emphasis on Postgres optimizations. But I’ve been exploring a lot of React in my free time this year.
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
