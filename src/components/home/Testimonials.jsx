import TestimonialsClient from "./TestimonialsClient";

export default function Testimonials() {
  const testimonials = [
    {
      id: "1",
      name: "Rahul Sharma",
      role: "Head Chef, Mumbai",
      quote: "This platform made finding my dream chef job so easy! I got hired at a top restaurant in just a week.",
      rating: 5,
    },
    {
      id: "2",
      name: "Priya Singh",
      role: "Restaurant Owner, Delhi",
      quote: "Hiring staff used to be a headache, but this site connected me with the perfect manager in no time!",
      rating: 4,
    },
    {
      id: "3",
      name: "Arjun Patel",
      role: "Waiter, Bangalore",
      quote: "I love how simple it is to browse jobs and apply. Got a part-time gig that fits my schedule perfectly.",
      rating: 5,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return <TestimonialsClient testimonials={testimonials} />
}