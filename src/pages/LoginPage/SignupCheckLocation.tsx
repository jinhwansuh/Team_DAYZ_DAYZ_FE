import styled from '@emotion/styled';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { userState } from '../../atom';
import { getlocationlist } from '../../utils/api/dayzApi';

interface IRegion {
  regionId: number;
  regionName: string;
}

function SignupCheckLocation() {
  const { token } = useRecoilValue(userState);
  const [regions, setRegions] = useState<IRegion[]>([]);
  useEffect(() => {
    getlocationlist(token).then((res) => {
      const seoulRegions = res.data.payload.addresses[0].regions;
      setRegions(seoulRegions);
    });
  }, []);
  return (
    <LoginContainer>
      <Title>
        <p>지역을</p>
        <p>알려주세요!</p>
      </Title>
      <Subtitle>
        <p>선택하신 지역에 가까운</p>
        <p>공방을 보여드려요</p>
      </Subtitle>
      <SelectContainer>
        <p>서울 외 지역은 아직 준비 중이에요😥</p>
        <div>
          <select name="area" id="area">
            <option value="seoul">서울</option>
          </select>
          <select defaultValue={'DEFAULT'} name="city" id="city">
            <option disabled value="DEFAULT">
              선택
            </option>
            {regions?.map((region) => (
              <option key={region.regionId} value={region.regionName}>
                {region.regionName}
              </option>
            ))}
          </select>
        </div>
      </SelectContainer>
    </LoginContainer>
  );
}
export default SignupCheckLocation;

const LoginContainer = styled.div`
  margin: 40px;
`;

const Title = styled.p`
  font-size: 52px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const Subtitle = styled.p`
  margin-bottom: 80px;
`;

const SelectContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  & p {
    margin-bottom: 12px;
  }
  & select {
    background-color: #eed6fc;
    border-style: none;
    border-radius: 12px;
    padding: 12px 24px;
  }
  & select:nth-of-type(1) {
    width: 100px;
    margin-right: 24px;
  }
  & select:nth-of-type(2) {
    width: 150px;
  }
`;
