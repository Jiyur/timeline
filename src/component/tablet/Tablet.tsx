import { DisabledInterval } from "@matiaslgonzalez/react-timeline-range-slider";
import { Button, Divider } from "antd";
import Flex from "antd/es/flex";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";
import { format, set } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";
import { isSameTime } from "../common/utils";
import Timeline from "../timeline/Timeline";
import "./Tablet.css";

type Activity = "create" | "use" | "busy" | "error"

type Props = {
  roomId?: String
}

const now = new Date();

const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 });

const mockMeeting: DisabledInterval[] = [
  {
  id: "Endyear Meeting",
  start: getTodayAtSpecificHour(9),
  end: getTodayAtSpecificHour(13),
    color: "gray"
  }
];

const Tablet = ({ roomId }: Props) => {
  const selectedStart = getTodayAtSpecificHour(8);
  const selectedEnd = getTodayAtSpecificHour(9);

  const [error, setError] = useState<boolean>(false);
  const [activity, setActivity] = useState<Activity>("create");
  const [meetings, setMeetings] = useState<DisabledInterval[]>(
    mockMeeting
  );
  const [selectedItem, setSelectedItem] = useState<DisabledInterval>();
  const [currentTime, setCurrentTime] =
    useState<[selectedStart: Date, selectedEnd: Date]>([selectedStart, selectedEnd,]);
  const statusColor = useMemo(() => {
    if (activity === "create") {
      return "#63c302";
    }
    if (activity === "use") {
      return "#ffc300";
    }
    return "#d5092f";

  }, [activity]);

  const statusText = useMemo(() => {
    if (activity === "use") {
      return "Ready to use";
    }
    if (activity === "busy") {
      return "This room is busy";
    }
    return "Not applicable";
  }, [activity]);

  const onTimeSelect = useCallback(() => {
    const selected = meetings?.find((meeting: DisabledInterval) => {
      if (isSameTime(meeting.start, currentTime[0]) && isSameTime(meeting.end, currentTime[1])) {
        setSelectedItem(meeting);
        return meeting;
      }
    });
    if (selected && selected.color === "gray") {
      setActivity("use");
      return;
    }
    if (selected && selected.color === "yellow") {
      setActivity("busy");
      return;
    }
    else {
      setActivity("error");
      setSelectedItem(undefined);
    }
  }, [currentTime, meetings]);

  const onUse = useCallback(() => {
    //Find index of selected item
    let itemIndex = meetings.findIndex((item) => item.id === selectedItem?.id);
    let newItem = meetings[itemIndex];
    //Update selected item status
    let newArray = Array.from(meetings);
    newArray[itemIndex] = { ...newItem, color: "yellow" };
    setMeetings(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, selectedItem, meetings]);

  const onCancel = useCallback(() => {
    //Find index of selected item
    let itemIndex = meetings.findIndex((item) => item.id === selectedItem?.id);
    let newArray = Array.from(meetings);
    //Delete item from data list
    newArray.splice(itemIndex, 1);
    setMeetings(newArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activity, selectedItem, meetings]);

  const buttonContent = useMemo(() => {
    if (activity === "use") {
      return (
        <Button onClick={onUse} size="large" type="primary" style={{ backgroundColor: "green" }}>
          Start
        </Button>
      );
    }
    if (activity === "busy") {
      return (
        <Button onClick={onCancel} size="large" type="primary" style={{ backgroundColor: "green" }}>
          Cancel
        </Button>
      );
    }
    else {
      return <></>;
    }
  }, [activity, onCancel, onUse]);

  useEffect(() => {
    onTimeSelect();
  }, [currentTime, onTimeSelect]);

  useEffect(() => {
    setCurrentTime([selectedStart, selectedEnd]);
    setMeetings(mockMeeting);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]);

  return (
    <div style={{ marginLeft: "1rem", marginRight: "1rem" }} >
      <Flex justify='start' className='header-text'>
        <Title level={4} style={{ color: "white" }}>{roomId?.toString()} </Title>
      </Flex>
      <Divider style={{ color: "white", background: "white" }} />
      <Flex align='center' style={{ marginBottom: 40 }} gap={60}>
        <Flex align='center' justify='center'
          style={{
            flexGrow: 1,
            minWidth: "50%",
            maxWidth: "50%",
            color: statusColor === "#ffc300" ? "black" : "white", padding: "70px 40px", background: statusColor,
            fontSize: "22px"
          }}>
          {statusText.toLocaleUpperCase()}
        </Flex>
        <div style={{ flexGrow: 1 }}>
          <Paragraph style={{ fontSize: 18, color: "white", textTransform: "uppercase" }} >
            {selectedItem?.id ?? "No meeting available this time"}
          </Paragraph>
          {activity !== "error" &&
            <div style={{ marginBottom: "2rem" }}>
              <span style={{ color: "white" }}>
                {format(currentTime[0], "H:mm")}-{format(currentTime[1], "H:mm")}
              </span>
              <Title level={4} style={{ color: "white", fontSize: 14 }}>Host by: Duong Nguyen</Title>
            </div>
          }
          {buttonContent}
        </div>
      </Flex >
      <Divider style={{ color: "white", background: "white" }} />
      <div>
        <Timeline
          setCurrentTime={setCurrentTime}
          meetings={meetings}
          error={error}
          setError={setError}
          currentTime={currentTime}
        />
      </div>
    </div>
  );
};

export default Tablet;