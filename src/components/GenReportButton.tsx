import { JSX } from "preact/jsx-runtime";
import { generateReportText } from "../utils";
import { useEffect, useState } from "preact/hooks";
import { reportData, reportType, settings } from "../signals";

const payPeriod = settings.value.payPeriod;

const getWeekOptions = (): number[] => {
  switch (payPeriod) {
    case "weekly":
      return [1];
    case "biweekly":
      return [1, 2];
    case "monthly":
      return [1, 2, 3, 4];
    default:
      return [];
  }
};

export function GenerateReportButton(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reportText, setReportText] = useState("");
  const [showModal, setShowModal] = useState(false);

  const generateReport = (type: string) => {
    reportType.value = settings.value.payPeriod;

    if (type !== "Full") {
      console.log("CUSTOM REPORT REQUESTED");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (Object.keys(reportData?.value ?? {}).length > 0) {
      const result = `🧾 Report Type: ${settings.value.payPeriod.toUpperCase()}\nPeriod: ${payPeriod}\nGenerated at: ${new Date().toLocaleString()}\n\n ${generateReportText(
        reportData.value
      )}`;
      setReportText(result);
      setCopied(false);
      setShowModal(true);
      setIsOpen(false);
    }
  }, [reportData.value, reportType.value]);

  return (
    <>
      <div class="flex justify-center lg:justify-end w-full">
        <div class="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-16 mt-3 bg-white hover:text-indigo-500 hover:bg-gray-100/80 text-gray-800 dark:bg-gray-700 hover:dark:bg-gray-800 dark:text-gray-200 dark:hover:text-sky-400 text-4xl p-4 rounded-md text-center mr-0 md:mr-5 mb-[-3rem]"
          >
            🖶
          </button>

          {isOpen && (
            <div class="absolute mt-6 left-1/2 -translate-x-1/2  lg:-translate-x-[90%] z-10 w-64 origin-top rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
              <div class="py-1">
                <button
                  class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => generateReport("Full")}
                >
                  📄 Full{" "}
                  {payPeriod.charAt(0).toUpperCase() + payPeriod.slice(1)}{" "}
                  Report
                </button>

                {getWeekOptions().map((week) => (
                  <button
                    key={week}
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                    onClick={() => generateReport(`Week ${week}`)}
                  >
                    📅 Week {week}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 w-full">
          <div class="bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 max-w-3xl w-full p-6 rounded-xl shadow-xl relative transform transition-all duration-300 scale-100 opacity-100">
            <button
              class="absolute top-3 right-4 text-lg text-gray-400 hover:text-red-500"
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>

            <h2 class="text-lg font-bold mb-2">Generated Report</h2>
            <pre class="whitespace-pre-wrap bg-gray-100 dark:bg-gray-700 p-4 rounded-md max-h-[400px] overflow-y-auto">
              {reportText}
            </pre>

            <button
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCopy}
            >
              {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
