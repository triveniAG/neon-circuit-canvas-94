const testimonials = [
  {
    name: "Ananya",
    year: "2nd Year ECE",
    review: "Circuit Vision helped me understand complex PCB layouts in minutes. The analysis is incredibly accurate!",
    avatar: "A"
  },
  {
    name: "Rahul",
    year: "3rd Year EEE",
    review: "Amazing tool for debugging circuits. It saved me hours of manual tracing and troubleshooting.",
    avatar: "R"
  },
  {
    name: "Priya",
    year: "4th Year ECE",
    review: "The scanner accuracy is impressive. Perfect companion for electronics lab projects!",
    avatar: "P"
  }
];

const StudentTestimonials = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12">
      {/* Section Title */}
      <div className="text-center mb-10">
        <h3 className="text-xl md:text-2xl font-display font-semibold tracking-wider text-glow">
          Students Love Circuit Vision
        </h3>
        <div className="mt-2 w-24 h-0.5 mx-auto bg-gradient-to-r from-transparent via-primary to-transparent" />
      </div>

      {/* Testimonial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((student, index) => (
          <div
            key={index}
            className="group relative"
          >
            {/* Card Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-xl blur opacity-0 group-hover:opacity-60 transition-opacity duration-300" />
            
            {/* Card */}
            <div className="relative glass-panel rounded-xl p-6 border border-primary/20 hover:border-primary/40 transition-colors duration-300">
              {/* Avatar */}
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-full opacity-60" />
                  <div className="relative w-12 h-12 rounded-full bg-background flex items-center justify-center border border-primary/30">
                    <span className="text-lg font-bold text-primary">{student.avatar}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{student.name}</h4>
                  <p className="text-xs text-muted-foreground">{student.year}</p>
                </div>
              </div>

              {/* Review */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                "{student.review}"
              </p>

              {/* Corner Accent */}
              <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r border-primary/30 rounded-br" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StudentTestimonials;
