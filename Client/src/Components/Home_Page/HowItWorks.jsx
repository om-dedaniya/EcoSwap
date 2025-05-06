import { motion } from "framer-motion";
import {
  FaUserPlus,
  FaListAlt,
  FaSearch,
  FaComments,
  FaExchangeAlt,
  FaLeaf,
  FaUsers,
  FaCalendarAlt,
} from "react-icons/fa";

const steps = [
  {
    icon: <FaUserPlus />,
    title: "Sign Up & Get Started",
    description: "Create an account to explore and exchange items with others.",
  },
  {
    icon: <FaListAlt />,
    title: "List an Item",
    description:
      "Upload and share items that you want to exchange or give away.",
  },
  {
    icon: <FaSearch />,
    title: "Find the Item You Want",
    description:
      "Search for items based on category, location, and availability.",
  },
  {
    icon: <FaComments />,
    title: "Connect with Users",
    description: "Chat with item owners and discuss exchange details.",
  },
  {
    icon: <FaExchangeAlt />,
    title: "Exchange or Processing",
    description: "Safely complete the exchange or process the item for reuse.",
  },
  {
    icon: <FaLeaf />,
    title: "Impact on the Environment",
    description: "Reduce waste by giving items a second life.",
  },
  {
    icon: <FaUsers />,
    title: "Join the Community",
    description:
      "Engage with like-minded people and contribute to sustainability.",
  },
  {
    icon: <FaCalendarAlt />,
    title: "Participate in Environmental Events",
    description: "Take part in public or private eco-friendly activities.",
  },
];

const StepCard = ({ step, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay: index * 0.1 }}
    className="bg-white rounded-xl p-6 shadow-lg flex flex-col items-center text-center gap-3 min-h-[280px]"
  >
    <div className="bg-green-500 text-white text-3xl p-4 rounded-full">
      {step.icon}
    </div>
    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
    <p className="text-sm text-gray-600">{step.description}</p>
    <span className="mt-2 px-3 py-1 bg-green-100 text-green-600 text-xs font-semibold rounded-full">
      Step {index + 1}
    </span>
  </motion.div>
);

const HowItWorksGrid = () => (
  <section className="bg-green-50 py-20 px-4 md:px-12">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
        How EcoSwap Works
      </h2>
      <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
        Join our community in just a few simple steps and start contributing to
        a more sustainable future.
      </p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <StepCard key={index} step={step} index={index} />
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorksGrid;
