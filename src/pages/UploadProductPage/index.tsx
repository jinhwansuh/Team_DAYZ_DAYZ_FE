import styled from '@emotion/styled';
import React, { ChangeEvent, ReactHTMLElement, useState } from 'react';
import { Upload } from '../../components/base';
import { Plus, MinusCircle } from 'react-feather';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../style/calendar.css';
import { ko } from 'date-fns/esm/locale';

const UploadProductPage = () => {
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState<string | ''>('');
  const [durationTime, setDurationTime] = useState<string | '1'>('1');
  const [imgLink, setImgLink] = useState<string | undefined>(undefined);
  const [pickDate, setPickDate] = useState<any | undefined>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e);
    console.log(e.target);
    // console.log(e.target.value);
  };

  const handlePost = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    if (date && startTime && durationTime) {
      const [startHour, startMinute] = startTime.split(':');
      const endHour: number = parseInt(startHour) + parseInt(durationTime);
      const endTime = endHour + ':' + startMinute;
      setPickDate([
        ...pickDate,
        {
          fixDate: date.toLocaleDateString(),
          fixStartTime: startTime,
          fixEndTime: endTime,
        },
      ]);
    }
  };

  console.log(pickDate);
  const handleDelete = (e: React.MouseEvent<HTMLTableDataCellElement, MouseEvent>) => {
    e.preventDefault();
    const target = (e.target as HTMLLIElement).closest('li')?.dataset.id;
    pickDate.splice(pickDate?.indexOf(target), 1);
    setPickDate([...pickDate]);
  };

  return (
    <UploadProductPageWrapper>
      <InputForm onSubmit={handleSubmit}>
        <InputTitle>클래스 이름</InputTitle>
        <InputBox style={{ height: '40px', width: '100% ' }} />
        <InputTitle>카테고리</InputTitle>
        <InputSelect>
          <option value="">카테고리를 선택해 주세요.</option>
          <option value="요리">요리</option>
          <option value="도자기">도자기</option>
          <option value="플라워">플라워</option>
          <option value="미술">미술</option>
          <option value="뷰티">뷰티</option>
          <option value="음악">음악</option>
          <option value="수공예">수공예</option>
          <option value="액티비티">액티비티</option>
        </InputSelect>
        <InputTitle>클래스 소개</InputTitle>
        <InputTextArea style={{ height: '100px' }} />
        <InputTitle>클래스 이미지</InputTitle>
        <Upload droppable accept="image/*" imgLink={imgLink} setImgLink={setImgLink}>
          {(file: File, dragging: React.DragEvent<HTMLDivElement>) => (
            <ImageWrapper>
              {file ? <img src={imgLink} style={{ width: '200px', paddingRight: '20px' }} /> : ''}

              <div
                style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #b88bd6 0%, #b88bd6 0.01%, #a8bac8 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Plus style={{ color: '#f5f5f5' }} size={40} />
              </div>
            </ImageWrapper>
          )}
        </Upload>
        <InputTitle>커리큘럼</InputTitle>
        <InputSubTitle>1단계</InputSubTitle>
        <InputTextArea />
        <InputSubTitle>2단계</InputSubTitle>
        <InputTextArea />
        <InputSubTitle>3단계</InputSubTitle>
        <InputTextArea />

        <ReactDatePicker
          selected={date}
          locale={ko}
          dateFormat="yyyy-MM-dd"
          onChange={(date: Date) => setDate(date)}
          inline
          minDate={new Date()}
        />

        <DatePickerWrapper className="dateLists">
          <div>
            <MiniInputWrapper>
              <InputSubTitle>선택 날짜</InputSubTitle>
              <InputSubTitle style={{ paddingLeft: '10px' }}>
                {date.toLocaleDateString()}
              </InputSubTitle>
            </MiniInputWrapper>
            <MiniInputWrapper>
              <InputSubTitle>진행 시간</InputSubTitle>
              <Select
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setDurationTime(e.target.value)}
              >
                <option value={1}>1시간</option>
                <option value={2}>2시간</option>
                <option value={3}>3시간</option>
                <option value={4}>4시간</option>
              </Select>
            </MiniInputWrapper>

            <MiniInputWrapper>
              <InputSubTitle>시작 시각</InputSubTitle>
              <input
                type="time"
                style={{
                  width: '120px',
                  height: '20px',
                  margin: '0 10px',
                  border: 'solid 1px #c4c4c4',
                  borderRadius: '4px',
                  color: 'black',
                  textAlign: 'center',
                }}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setStartTime((e.target as HTMLInputElement).value)
                }
              />
              <Button onClick={handlePost}>+ 추가</Button>
            </MiniInputWrapper>
          </div>
          {/* <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              marginLeft: '22px',
            }}
          >
            <InputSubTitle>선택한 날짜</InputSubTitle>
            <InputSubTitle style={{ marginLeft: '50px' }}>시작 시각</InputSubTitle>
            <InputSubTitle style={{ marginLeft: '40px' }}>종료 시각</InputSubTitle>
          </div> */}
          <InputSubTitle>[클래스 날짜 정보]</InputSubTitle>
          {pickDate ? (
            <table style={{ marginTop: '10px' }}>
              <thead style={{ borderBottom: 'solid 1px #c4c4c4' }}>
                <tr style={{ textAlign: 'center' }}>
                  <th style={{ borderRight: 'solid 1px #c4c4c4' }}>No.</th>
                  <th>선택 날짜</th>
                  <th style={{ padding: '0 10px' }}>시작 시각</th>
                  <th style={{ padding: '0 10px' }}>종료 시각</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {pickDate
                  ? pickDate.map((date: any, index: number) => (
                      <tr key={index + 1} style={{ textAlign: 'center' }}>
                        <td
                          style={{
                            borderRight: 'solid 1px #c4c4c4',
                          }}
                        >
                          {index + 1}
                        </td>
                        <td>{date.fixDate}</td>
                        <td>{date.fixStartTime}</td>
                        <td> {date.fixEndTime}</td>
                        <td onClick={handleDelete}>
                          <MinusCircle style={{ color: 'red' }} size={16} />
                        </td>
                      </tr>
                    ))
                  : ''}
              </tbody>
            </table>
          ) : (
            <div>날짜와 시간을 선택해 주세요!</div>
          )}

          {/* {pickDate
            ? pickDate.map((date: any) => (
                <li
                  key={date}
                  data-id={date}
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    margin: '3px 0px',
                  }}
                >
                  <MinusCircle style={{ color: 'black' }} size={16} onClick={handleDelete} />
                  <DateDiv>{date.fixDate}</DateDiv>
                  <DateDiv style={{ marginLeft: '40px' }}>{date.fixStartTime}</DateDiv>
                  <DateDiv>{date.fixEndTime}</DateDiv>
                </li>
              ))
            : ''} */}
        </DatePickerWrapper>

        <RowInputForm>
          <InputTitle>인원</InputTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <InputBox type="number" style={{ height: '30px', width: '160px' }} />
            <InputSubTitle style={{ fontSize: '20px', marginLeft: '10px' }}>명</InputSubTitle>
          </div>
        </RowInputForm>
        <RowInputForm>
          <InputTitle>가격</InputTitle>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <InputBox type="number" style={{ height: '30px', width: '160px' }} />
            <InputSubTitle style={{ fontSize: '20px', marginLeft: '10px' }}>원</InputSubTitle>
          </div>
        </RowInputForm>

        <Submit type="submit"> 클래스 추가</Submit>
      </InputForm>
    </UploadProductPageWrapper>
  );
};

const UploadProductPageWrapper = styled.section`
  width: 100%;
  box-sizing: border-box;
`;
const InputForm = styled.form`
  margin: 20px;
`;
const InputTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
`;
const InputSubTitle = styled.h4`
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
`;
const ImageWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
  overflow-x: auto;
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const InputBox = styled.input`
  border: solid 1px #c4c4c4;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: flex-start;
  padding: 0;
`;
const InputSelect = styled.select`
  width: 100%;
  height: 40px;
  border: solid 1px #c4c4c4;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: flex-start;
  color: black;
`;
const InputTextArea = styled.textarea`
  width: 100%;
  border: solid 1px #c4c4c4;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 20px;
  margin-bottom: 10px;
  text-align: flex-start;
  padding: 0;
`;
const Button = styled.button`
  width: 60px;
  height: 20px;
  display: block;
  border: none;
  outline: none;
  border-radius: 4px;
  background: linear-gradient(135deg, #b88bd6 0%, #b88bd6 0.01%, #a8bac8 100%);
  color: #f5f5f5;
  font-weight: 600;
`;
const RowInputForm = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Submit = styled.button`
  width: 40%;
  height: 50px;
  background: linear-gradient(135deg, #b88bd6 0%, #b88bd6 0.01%, #a8bac8 100%);
  border: none;
  text-decoration: none;
  border-radius: 16px;
  color: #f5f5f5;
  font-size: 20px;
  font-weight: 700;
  margin: 20px 30%;
`;
const DateDiv = styled.div`
  font-size: 16px;
  margin-left: 10px;
  width: 90px;
`;
const Select = styled.select`
  width: 130px;
  height: 20px;
  border-radius: 4px;
  border: solid 1px #c4c4c4;
  text-align: center;
  font-size: 16px;
  margin-left: 10px;
  color: black;
  padding: 0;
`;

const MiniInputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-left: 22px;
`;

const DatePickerWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
export default UploadProductPage;
