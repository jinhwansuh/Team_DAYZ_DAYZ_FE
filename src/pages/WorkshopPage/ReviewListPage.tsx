import React from 'react';
import styled from '@emotion/styled';
import { Star } from 'react-feather';
import { Avatar, Image, Text } from '../../components/base';
import { DUMMY_REVIEW_DATA } from './DUMMY_DATA';

const ReviewListPage = () => {
  const { averageScore, reviews } = DUMMY_REVIEW_DATA;

  return (
    <>
      <StarContainer>
        <Star size={20} />
        <Star size={20} />
        <Star size={20} />
        <Star size={20} style={{ marginRight: '12px' }} />
        <span>{averageScore}</span>
      </StarContainer>
      <section>
        {reviews.length
          ? reviews.map(
              ({
                reviewId,
                createdAt,
                title,
                content,
                score,
                images,
                member: { memberId, name, imageUrl },
              }) => (
                <ReviewContainer key={reviewId}>
                  <AteliarWrapper>
                    <Avatar
                      lazy
                      src={imageUrl}
                      shape="circle"
                      size={60}
                      alt="profile"
                      placeholder="https://via.placeholder.com/150"
                    />
                    <AteliarDetailWrapper>
                      <StyledText>{name}</StyledText>
                      <StyledText>{createdAt}</StyledText>
                    </AteliarDetailWrapper>
                  </AteliarWrapper>
                  <ContentWrapper>{content}</ContentWrapper>
                  <ImageContainer>
                    {images.length
                      ? images.map(({ imageUrl, sequence }) => (
                          <ImageWrapper key={sequence}>
                            <Image
                              lazy
                              src={imageUrl}
                              width={'100%'}
                              height={'100%'}
                              alt="contents"
                              mode="fill"
                              style={{ borderRadius: '12px', minWidth: '120px' }}
                            />
                          </ImageWrapper>
                        ))
                      : ''}
                  </ImageContainer>
                </ReviewContainer>
              ),
            )
          : '리뷰가 없어요 ㅠ'}
      </section>
    </>
  );
};

const StarContainer = styled.div`
  margin: 12px;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: rgb(184, 139, 214);
`;

const ReviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid black;
  box-sizing: border-box;
  padding: 0 20px;
  margin-bottom: 30px;
`;

const AteliarWrapper = styled.div`
  display: flex;
  margin-top: 20px;
  align-items: center;
`;

const AteliarDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 20px;
`;

const StyledText = styled(Text)`
  margin: 5px 0;
`;

const ContentWrapper = styled.div`
  margin: 20px 0;
  box-sizing: border-box;
  padding: 0 20px;
  font-weight: bold;
`;
const ImageContainer = styled.div`
  display: flex;
  height: 120px;
  overflow-x: auto;
  box-sizing: border-box;
  padding: 0 20px;
  & {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  &::-webkit-scrollbar {
    display: none;
  }
`;
const ImageWrapper = styled.div`
  margin-right: 10px;
`;

export default ReviewListPage;
