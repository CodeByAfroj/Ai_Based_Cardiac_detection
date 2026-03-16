export const generateReport = (data, duration) => {

  let counts = {
    N: 0,
    A: 0,
    V: 0,
    L: 0,
    R: 0
  };

  data.forEach(b => {
    if (counts[b] !== undefined) counts[b]++;
  });

  let conclusion = "Normal Heart Rhythm";

  if (counts.V > 10) {
    conclusion = "Possible Ventricular Arrhythmia Detected";
  }
  else if (counts.A > 15) {
    conclusion = "Frequent Atrial Premature Beats Detected";
  }

  return {
    duration,
    total: data.length,
    counts,
    conclusion
  };
};