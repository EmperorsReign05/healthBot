// lib/knowledge_base.ts

// A simple knowledge base of public health topics
const healthTopics = [
  {
    topic: "Dengue",
    content: "Dengue fever is a mosquito-borne illness. Symptoms typically include high fever, severe headache, pain behind the eyes, joint and muscle pain, rash, and mild bleeding. Prevention focuses on eliminating mosquito breeding sites by removing stagnant water, using mosquito repellent, and wearing protective clothing."
  },
  {
    topic: "Malaria",
    content: "Malaria is a life-threatening disease caused by parasites transmitted through the bites of infected female Anopheles mosquitoes. Symptoms include fever, chills, headache, and flu-like illness. Key prevention methods include sleeping under insecticide-treated nets and using indoor residual spraying."
  },
  {
    topic: "Diarrhea",
    content: "Diarrhea is characterized by loose, watery stools. It is often caused by contaminated food or water. Prevention involves practicing good hygiene, such as washing hands with soap, drinking safe and boiled water, and eating properly cooked food. Staying hydrated with oral rehydration salts (ORS) is crucial for treatment."
  },
  {
    topic: "Vaccination",
    content: "Vaccination is a safe and effective way to protect against serious diseases. The child immunization schedule in India includes vaccines for BCG (Tuberculosis), Polio, Hepatitis B, DPT (Diphtheria, Pertussis, Tetanus), and Measles. It is important to follow the schedule provided by healthcare professionals."
  }
];

// A simple function to search the knowledge base
// We will make this more advanced with vector search later
export function searchKnowledgeBase(query: string): string {
  const lowerCaseQuery = query.toLowerCase();
  
  // Find the first topic that is mentioned in the user's query
  const relevantTopic = healthTopics.find(item => lowerCaseQuery.includes(item.topic.toLowerCase()));
  
  // If a relevant topic is found, return its content. Otherwise, return a default message.
  return relevantTopic ? relevantTopic.content : "No specific information found in the knowledge base.";
}