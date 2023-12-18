import { DisabledInterval, TimeRange, UpdateCallbackData } from "@matiaslgonzalez/react-timeline-range-slider";
import { endOfToday, format, set } from "date-fns";

type Props = {
  setCurrentTime: Function;
  error: boolean;
  setError: Function;
  meetings?: DisabledInterval[];
  currentTime: [selectedStart: Date, selectedEnd: Date]
}

const now = new Date();

const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

const startTime = getTodayAtSpecificHour(7);
const endTime = endOfToday();

export default function Timeline({
  setCurrentTime,
  currentTime,
  error,
  setError,
  meetings
}: Props) {

  const errorHandler = ({ error, time }: UpdateCallbackData) => { setError(error); };

  const onChangeCallback = (currentTime: [selectedStart: Date, selectedEnd: Date]) => {
    setCurrentTime(currentTime);
  };

  return (
    < >
      <TimeRange
        mode={3}
        error={error}
        ticksNumber={60}
        formatTick={(ms) => { return format(ms, "H"); }}
        selectedInterval={currentTime}
        timelineInterval={[startTime, endTime]}
        onUpdateCallback={errorHandler}
        onChangeCallback={onChangeCallback}
        disabledIntervals={meetings}
      />
    </>
  );
}