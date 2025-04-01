import React from 'react'
import { Carousel } from "@mantine/carousel";

function About() {
  return (
    <div>asdf


<Carousel slideSize="70%" height={200} slideGap="xs" controlsOffset="xs" controlSize={39} loop dragFree>
      <Carousel.Slide>1</Carousel.Slide>
      <Carousel.Slide>2</Carousel.Slide>
      <Carousel.Slide>3</Carousel.Slide>
      {/* ...other slides */}
    </Carousel>
    </div>
  )
}

export default About
