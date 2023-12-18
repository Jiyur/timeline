import { Button, Divider, Table } from "antd"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { format, set } from "date-fns"
import Flex from 'antd/es/flex'
import Title from 'antd/es/typography/Title'
import Paragraph from 'antd/es/typography/Paragraph'
import { DisabledInterval } from "@matiaslgonzalez/react-timeline-range-slider"
import { isSameTime } from "../common/utils"
import Timeline from "../timeline/Timeline"
import './Tablet.css'

type Activity = 'create' | 'use' | 'busy' | 'error'

type Props = {
  roomId?: String
}

const now = new Date();
const getTodayAtSpecificHour = (hour = 12) =>
  set(now, { hours: hour, minutes: 0, seconds: 0, milliseconds: 0 })

const Tablet = ({ roomId }: Props) => {
  const selectedStart = getTodayAtSpecificHour(8);
  const selectedEnd = getTodayAtSpecificHour(9);

  const [error, setError] = useState<boolean>(false);
  const [activity, setActivity] = useState<Activity>('create')
  const [meetings, setMeetings] = useState<DisabledInterval[]>(
    [{
      id: "Endyear Meeting",
      start: getTodayAtSpecificHour(9),
      end: getTodayAtSpecificHour(13),
      color: 'gray'
    }]
  )
  const [selectedItem, setSelectedItem] = useState<DisabledInterval>()
  const [currentTime, setCurrentTime] =
    useState<[selectedStart: Date, selectedEnd: Date]>([
      selectedStart,
      selectedEnd,
    ])
  const statusColor = useMemo(() => {
    if (activity === 'create') {
      return '#63c302'
    }
    if (activity === 'use') {
      return '#ffc300'
    }
    return '#d5092f'

  }, [activity])

  const statusText = useMemo(() => {
    if (activity === 'use') {
      return 'Ready to use'
    }
    if (activity === 'busy') {
      return 'This room is busy'
    }
    return 'Not applicable'
  }, [activity])

  useEffect(() => {
    setCurrentTime([selectedStart, selectedEnd])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId])

  const handleOnSave = () => {
    if (error || isSameTime(currentTime[0], currentTime[1])) {
      return
    }

    const newMeetings = Array.from(meetings || []);
    newMeetings.push({
      id: ("Meeting " + newMeetings.length).toString(),
      start: currentTime[0],
      end: currentTime[1],
      color: 'yellow'
    })
    setMeetings(newMeetings)
  }

  const onTimeSelect = useCallback(() => {
    const selected = meetings?.find((meeting: DisabledInterval) => {
      if (isSameTime(meeting.start, currentTime[0]) && isSameTime(meeting.end, currentTime[1])) {
        setSelectedItem(meeting)
        return meeting
      }
    })
    if (selected && selected.color === 'gray') {
      setActivity('use')
      return;

    }
    if (selected && selected.color === 'yellow') {
      setActivity('busy')
      return
    }

    else {
      setActivity('error')
      setSelectedItem(undefined)
    }
  }, [currentTime, meetings])

  const onChangeStatus = useCallback(() => {
    let itemIndex;
    if (activity === 'use') {
      itemIndex = meetings.findIndex((item) => item.id === selectedItem?.id)
      let newItem = meetings[itemIndex]
      let newArray = Array.from(meetings)
      newArray[itemIndex] = { ...newItem, color: 'yellow' }
      setMeetings(newArray)
    }
  }, [activity, selectedItem, meetings])

  useEffect(() => {
    onTimeSelect()
  }, [currentTime, onTimeSelect])


  return (
    <div style={{ marginLeft: '1rem', marginRight: '1rem' }} >
      <Flex justify='start' className='header-text'>
        <Title level={4} style={{ color: 'white' }}>{roomId?.toString()} </Title>
      </Flex>
      <Divider style={{ color: 'white', background: 'white' }} />
      <Flex align='center' style={{ marginBottom: 40 }} gap={60}>
        <Flex align='center' justify='center'
          style={{
            flexGrow: 1,
            color: statusColor === '#ffc300' ? 'black' : 'white', padding: '70px 40px', background: statusColor,
            fontSize: '22px'
          }}>
          {statusText.toLocaleUpperCase()}
        </Flex>
        <div style={{ flexGrow: 1 }}>
          <Paragraph style={{ fontSize: 16, color: 'white', textTransform: 'uppercase' }} >
            {selectedItem?.id ?? 'No meeting available this time'}
          </Paragraph>
          <Title level={5} style={{ color: 'white' }}>
            {format(currentTime[0], 'H:mm')}-{format(currentTime[1], 'H:mm')}
          </Title>
          <Title level={5} style={{ color: 'white', fontSize: 14 }}>Host by: Duong Nguyen</Title>
          <Paragraph style={{ fontSize: 16, fontWeight: 'bolder', color: 'white' }}>
          </Paragraph>
          <Button
            type="primary"
            size="large"
            onClick={onChangeStatus}>
            {activity.toUpperCase()}
          </Button>
        </div>
      </Flex >
      <Divider style={{ color: 'white', background: 'white' }} />
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
  )
}

export default Tablet