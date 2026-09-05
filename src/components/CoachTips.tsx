import { COACH_TIPS } from "../data/plan";

export function CoachTips() {
  return (
    <section className="coachbox">
      <h2>Florian's part</h2>
      <ul>
        {COACH_TIPS.map((tip) => (
          <li key={tip}>{tip}</li>
        ))}
      </ul>
    </section>
  );
}
