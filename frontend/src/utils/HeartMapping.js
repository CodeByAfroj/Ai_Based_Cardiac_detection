
export function getHeartRegion(beat) {

  if (!beat) return "normal";

  const label = beat.toUpperCase();

  switch (label) {

    case "V":
      // Ventricular premature beat
      return "ventricles";

    case "A":
      // Atrial premature beat
      return "atria";

    case "L":
      // Left bundle branch block
      return "leftBundle";

    case "R":
      // Right bundle branch block
      return "rightBundle";

    case "N":
    default:
      // Normal heartbeat
      return "normal";

  }

}

