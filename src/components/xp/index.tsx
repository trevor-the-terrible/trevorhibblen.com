import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export function Xp() {
  return (
    <Card
      id="xp"
      class="
          text-pretty subpixel-antialiased
          my-6
          relative
        "
    >
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>

      <CardContent class="prose dark:prose-invert">
        <p>
          Experienced full-stack developer. I’ve successfully managed and
          developed complete platforms and feature-sets from zero to production
          across a wide range of technologies. Quite comfortable in fast-paced
          environments and good taking on multiple roles, from gathering
          requirements, mentoring new developers, all aspects of design and
          development (ui/ux/client/server/database structure), to addressing
          stakeholder feedback and customer support. I value good design
          fundamentals, understanding the customer and product, and being an
          uplifting force to those around me.
        </p>

        <h4>About this site</h4>
        <p>
          Developed in Astro, with SolidJS components. Most of the sections were
          fairly easy to implement. The most challenging portion was the
          Feedback form.
          <h5 class="m-0">Technologies used</h5>
          <ul class="tracking-tight mt-0">
            <li class="m-0 p-0">
              <a href="https://astro.build/" target="astro.build">
                Astro
              </a>
            </li>
            <li class="m-0 p-0">
              <a href="https://www.solidjs.com/" target="solidjs.com">
                SolidJS
              </a>
            </li>
            <li class="m-0 p-0">
              <a href="https://tailwindcss.com/" target="tailwindcss.com">
                Tailwind
              </a>
            </li>
            <li class="m-0 p-0">
              <a href="https://ui.shadcn.com/" target="_blank">
                Shadcn
              </a>
            </li>
          </ul>
        </p>
      </CardContent>
    </Card>
  );
}
