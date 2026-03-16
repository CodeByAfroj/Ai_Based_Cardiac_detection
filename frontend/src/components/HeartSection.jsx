
import heart from "../assets/heart.png";

export default function HeartSection({ region }) {

  return (

    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center">

      <h2 className="text-xl font-semibold mb-4">
        AI Detected Affected Region
      </h2>

      <div className="relative w-[350px]">

        {/* Heart base image */}
        <img src={heart} alt="Heart" />

        {/* SVG overlay */}
        <svg
          viewBox="0 0 350 350"
          className="absolute top-0 left-0"
        >

          {/* Ventricles (lower large area) */}
          {region === "ventricles" && (
            <ellipse
              cx="175"
              cy="230"
              rx="90"
              ry="90"
              fill="red"
              opacity="0.45"
            />
          )}

          {/* Atria (upper chambers) */}
          {region === "atria" && (
            <ellipse
              cx="170"
              cy="120"
              rx="75"
              ry="55"
              fill="orange"
              opacity="0.45"
            />
          )}

          {/* Left conduction bundle */}
          {region === "leftBundle" && (
            <rect
              x="120"
              y="170"
              width="40"
              height="110"
              fill="purple"
              opacity="0.45"
            />
          )}

          {/* Right conduction bundle */}
          {region === "rightBundle" && (
            <rect
              x="200"
              y="170"
              width="40"
              height="110"
              fill="blue"
              opacity="0.45"
            />
          )}

        </svg>

      </div>

    </div>

  );
}

