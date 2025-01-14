import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Button, Text } from '../../components/base';
import { AteliarInformation, GoBack, SimpleReview } from '../../components/domain';
import ReviewModal from './ReviewModal';
import Flicking, { ViewportSlot } from '@egjs/react-flicking';
import { Pagination } from '@egjs/flicking-plugins';
import '@egjs/react-flicking/dist/flicking.css';
import '@egjs/react-flicking/dist/flicking-inline.css';
import '@egjs/flicking-plugins/dist/pagination.css';
import { Star } from 'react-feather';
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { modalState, navigationState, userState } from '../../atoms';
import { fetchProductById, fetchProductReviewById } from '../../utils/api/dayzApi';
import Loader from 'react-loader-spinner';
import { ChevronLeft } from 'react-feather';

interface IImage {
  imageUrl: string;
  sequence: number;
}

interface ICurricurum {
  curricurumId: number;
  step: number;
  content: string;
}

interface IAtelier {
  address: string;
  atelierId: number;
  callNumber: string;
  endTime: string;
  name: string;
  startTime: string;
  imageUrl: string;
}

interface IProductProps {
  atelier: IAtelier;
  avgScore: number;
  classId: number;
  curriculums: ICurricurum[];
  images: IImage[];
  intro: string;
  maxPeopleNumber: number;
  name: string;
  price: number;
}

export interface IReviewImage {
  imageUrl: string;
  sequence: number;
}

export interface IMember {
  id: number;
  profileImageUrl: string;
  username: string;
}

export interface IList {
  content: string;
  createdAt: string;
  id: number;
  member: IMember;
  reviewImage: IReviewImage[];
}

export interface IReviewProps {
  hasNext: boolean;
  list: IList[];
}

const ProductsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { token } = useRecoilValue(userState);
  const [visible, setVisible] = useState(false);
  const [productData, setProductData] = useState<IProductProps>();
  const [reviewData, setReviewData] = useState<IReviewProps>();
  const [isLoading, setIsLoading] = useState(productData == null);
  const history = useHistory();
  const setModalState = useSetRecoilState(modalState);
  const resetModalState = useResetRecoilState(modalState);
  const setNavigationState = useSetRecoilState(navigationState);
  const resetPageState = useResetRecoilState(navigationState);
  useEffect(() => {
    setModalState(() => ({
      modalView: true,
    }));
    setNavigationState((prev) => ({
      ...prev,
      topNavigation: false,
      bottomNavigation: false,
    }));
    fetchProductById(token, +id).then((res) => {
      setProductData(res.data);
      fetchProductReviewById(token, +res.data.classId).then((res) => setReviewData(res.data));
      setIsLoading(false);
    });
    return () => {
      resetModalState();
      resetPageState();
    };
  }, []);
  const handleClick = () => {
    const bookingData = {
      name: productData!.name,
      maxPeopleNumber: productData!.maxPeopleNumber,
      price: productData!.price,
    };
    history.push(`/booking/${id}`, {
      ...bookingData,
    });
  };

  const fomatPhoneNum = (num: string) => {
    return num.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
  };

  const countStar = (num: any) => {
    const starArray = [];
    for (let i = 0; i < num; i++) {
      starArray.push(<Star size={18} style={{ paddingBottom: '5px' }} />);
    }
    return starArray;
  };

  return isLoading ? (
    <Loader type="Oval" color="#B88BD6" height={80} width={80} />
  ) : (
    <>
      <DetailPageHeader onClick={() => history.goBack()}>
        <ChevronLeft size={30} /> 이전
      </DetailPageHeader>
      <Flicking align="prev" circular={false} plugins={[new Pagination({ type: 'bullet' })]}>
        {productData?.images.map((url) => (
          <img key={url.sequence} style={{ width: '100%', height: '250px' }} src={url.imageUrl} />
        ))}
        <ViewportSlot>
          {productData!.images!.length ?? 0 > 1 ? (
            <div className="flicking-pagination" />
          ) : (
            <div className="flicking-pagination" style={{ display: 'none' }} />
          )}
        </ViewportSlot>
      </Flicking>
      <ProductsDetailContainer>
        <ProductNameWrapper>
          <Text style={{ fontSize: 30, fontWeight: 800 }}>{productData?.name}</Text>
          <RatingWrapper>
            {countStar(productData?.avgScore.toString().slice(0, 1))}
            <div style={{ paddingLeft: '5px' }}>{productData?.avgScore.toString().slice(0, 1)}</div>
          </RatingWrapper>
        </ProductNameWrapper>
        <ProductContentWrapper>
          <HeaderText>클래스 소개</HeaderText>
          <ContentWrapper> {productData?.intro}</ContentWrapper>
        </ProductContentWrapper>
        <ProductContentWrapper>
          <HeaderText>커리큘럼</HeaderText>
          {productData?.curriculums.map((curricurum, i) => (
            <ContentWrapper key={curricurum.curricurumId}>
              <Bullet
                style={{
                  backgroundColor: `rgb(184, 139, 214, ${i / productData.curriculums.length + 0.4}`,
                }}
              />
              {curricurum.step}단계 {curricurum.content}
            </ContentWrapper>
          ))}
        </ProductContentWrapper>
      </ProductsDetailContainer>
      <ProductReviewContainer>
        <HeaderText>
          <span>후기({reviewData?.list.length})</span>
        </HeaderText>
        <SimpleReviewContainer>
          {reviewData?.list.slice(0, 2).map((review) => (
            <SimpleReview key={review.id} date={review.createdAt}>
              {review.content}
            </SimpleReview>
          ))}
        </SimpleReviewContainer>
        <MoreReviewWrapper>
          <span onClick={() => setVisible(true)}>+ 후기 더보기</span>
        </MoreReviewWrapper>
      </ProductReviewContainer>
      <AuthorDetailContainer>
        <HeaderText>작가 정보</HeaderText>
        <AteliarInformation
          profileImg={productData?.atelier.imageUrl}
          name={productData?.atelier.name}
          phoneNumber={fomatPhoneNum(productData!.atelier.callNumber)}
          openTime={`${productData?.atelier.startTime} ~ ${productData?.atelier.endTime}`}
        />
      </AuthorDetailContainer>
      <ReservationContainer>
        <HeaderText>{productData?.price.toLocaleString()}원</HeaderText>
        <ReservationButton type="button" onClick={handleClick}>
          예약하기
        </ReservationButton>
      </ReservationContainer>
      <ReviewModal
        avgScore={+productData!.avgScore.toString().slice(0, 1)}
        id={+id}
        visible={visible}
        setVisible={setVisible}
      />
    </>
  );
};

const DetailPageHeader = styled.button`
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 101;
  height: 40px;
  font-weight: 600;
  font-size: 18px;
  background: #ffffffa4;
  width: 100%;
  border: none;
`;

const ProductsDetailContainer = styled.section`
  margin: 20px 0;
  padding: 0 20px;
  border-bottom: 1px solid #c4c4c4;
`;
const ProductNameWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px 0;
`;
const ProductContentWrapper = styled.div`
  margin: 20px 0;
`;
const ContentWrapper = styled.div`
  margin: 10px 0;
  padding-left: 10px;
  align-items: center;
`;
const HeaderText = styled(Text)`
  font-size: 20px;
  font-weight: 700;
`;
const ProductReviewContainer = styled.div`
  margin: 20px 0;
  border-bottom: 1px solid #c4c4c4;
  padding: 0 20px;
`;
const SimpleReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const MoreReviewWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 20px 0;
`;
const AuthorDetailContainer = styled.div`
  padding: 0 20px;
  padding-bottom: calc(${(props) => props.theme.height.bottomHeight});
`;
const ReservationContainer = styled.div`
  position: fixed;
  width: 100%;
  max-width: 640px;
  display: flex;
  bottom: 0;
  z-index: 100;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-top: 1px solid #c4c4c4;
  padding: 10px 0;
  background-color: #ffffff;
`;
const ReservationButton = styled(Button)`
  height: 56px;
  width: 174px;
  border-radius: 15px;
  font-weight: bold;
  font-size: 25px;
  line-height: 29px;
  color: #f5f5f5;
`;
const Bullet = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
`;
const RatingWrapper = styled.div`
  display: flex;
  margin-top: 12px;
  color: #b88bd6;
  & div {
    font-size: 18px;
  }
`;
export default ProductsDetailPage;
