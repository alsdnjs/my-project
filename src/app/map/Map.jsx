"use client";
import React, { useEffect, useState } from "react";

const Map = () => {
  const [campData, setCampData] = useState([]);
  const [filteredCamps, setFilteredCamps] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 한 페이지에 6개 (3개씩 2열)

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=82653f2edcf163a11fb5d8dc0dab9587&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          const mapContainer = document.getElementById("map");
          const mapOptions = {
            center: new window.kakao.maps.LatLng(36.5, 127.5), // 대한민국 중심 좌표
            level: 13, // 확대 레벨
          };

          const map = new window.kakao.maps.Map(mapContainer, mapOptions);

          // 광역시 마커 데이터 (서울, 부산, 대구, 인천, 광주 등)
          const markers = [
            { id: 1, name: "서울", lat: 37.5665, lng: 126.978 },
            { id: 2, name: "부산", lat: 35.1796, lng: 129.0756 },
            { id: 3, name: "대구", lat: 35.8714, lng: 128.6014 },
            { id: 4, name: "인천", lat: 37.4563, lng: 126.7052 },
            { id: 5, name: "광주", lat: 35.1595, lng: 126.8526 },
            { id: 6, name: "대전", lat: 36.3504, lng: 127.3845 },
            { id: 7, name: "울산", lat: 35.5371, lng: 129.3113 },
            { id: 8, name: "경기", lat: 37.4138, lng: 127.5183 },
            { id: 9, name: "강원", lat: 37.8228, lng: 128.1555 },
            { id: 10, name: "충북", lat: 36.635, lng: 127.9906 },
            { id: 11, name: "충남", lat: 36.5186, lng: 126.8012 },
            { id: 12, name: "전북", lat: 35.7177, lng: 127.1533 },
            { id: 13, name: "전남", lat: 34.8141, lng: 126.9534 },
            { id: 14, name: "경북", lat: 36.5761, lng: 128.5085 },
            { id: 15, name: "경남", lat: 35.4606, lng: 128.2132 },
            { id: 16, name: "제주", lat: 33.4996, lng: 126.5312 },
          ];

          // 마커 생성
          markers.forEach((markerData) => {
            const position = new window.kakao.maps.LatLng(markerData.lat, markerData.lng);
            const marker = new window.kakao.maps.Marker({
              position,
              map,
            });

            // 마커에 지역 이름을 표시할 label 생성
            const label = new window.kakao.maps.CustomOverlay({
              position: position,
              content: `<div style="background-color: white; padding: 3px; border-radius: 3px; border: 1px solid #ccc; font-size: 10px;">${markerData.name}</div>`,
              xAnchor: 0.5, // 마커를 기준으로 수평 가운데 정렬
              yAnchor: 2.5, // 마커 아래에 위치하도록 설정
            });

            // 라벨을 지도에 추가
            label.setMap(map);

            // 마커 클릭 이벤트
            window.kakao.maps.event.addListener(marker, "click", () => {
              fetchCampData(markerData.name); // 지역 기반 데이터 호출
            });
          });
        });
      } else {
        console.error("카카오맵 API 로드 실패");
      }
    };

    script.onerror = () => {
      console.error("카카오맵 스크립트 로드 중 오류 발생");
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const fetchCampData = async (region) => {
    try {
      const response = await fetch(
        `https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=0nU1JWq4PQ1i5sjvesSwir9C4yWQy66K695whewvIpbxtuV1H5ZU8gDIp4c0N9rL4Yt4wQU5eLviLsHKxks9rg%3D%3D&numOfRows=2000&pageNo=1&MobileOS=ETC&MobileApp=AppTest&_type=json`
      );
      const data = await response.json();
      const camps = data.response.body.items.item;
      setCampData(camps);

      const filtered = camps.filter((camp) => camp.addr1.includes(region));
      setFilteredCamps(filtered);
      setCurrentPage(1); // 페이지를 처음으로 리셋
    } catch (error) {
      console.error("캠핑장 데이터를 가져오는 중 오류 발생:", error);
    }
  };

  // 현재 페이지에 해당하는 캠핑장 데이터 가져오기
  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCamps.slice(startIndex, startIndex + itemsPerPage);
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredCamps.length / itemsPerPage);

  // 페이지 번호 생성 (5페이지 이상일 경우)
  const generatePageNumbers = () => {
    const pageNumbers = [];
    if (totalPages > 5) {
      let start = Math.max(currentPage - 2, 1); // 현재 페이지 기준으로 이전 2페이지부터 시작
      let end = Math.min(currentPage + 2, totalPages); // 현재 페이지 기준으로 다음 2페이지까지 표시

      for (let i = start; i <= end; i++) {
        pageNumbers.push(i);
      }

      // 5 페이지 이상일 때, 5 페이지 이상 넘어가면 '...' 추가
      if (end < totalPages) {
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }

      // 5 페이지 이상일 경우 1 페이지를 추가로 포함시킬 수 있음
      if (start > 1) {
        pageNumbers.unshift(1);
        if (start > 2) {
          pageNumbers.unshift("...");
        }
      }
    } else {
      // 5페이지 이하인 경우 모든 페이지 표시
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  return (
    <div style={{ display: "flex" }}>
      <div id="map" style={{ width: "43%", height: "500px", marginRight: "20px" }}></div>
      <div style={{ width: "40%" }}>
        <h3>캠핑장 정보</h3>
        <p>총 캠핑장 수: {filteredCamps.length}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)", // 3개씩 가로로 나열
            gap: "20px",
          }}
        >
          {getCurrentPageData().length > 0 ? (
            getCurrentPageData().map((camp) => (
              <div key={camp.contentId} style={{ marginBottom: "20px" }}>
                <div>
                  <strong>{camp.facltNm}</strong> - {camp.addr1}
                </div>
                {camp.firstImageUrl ? (
                  <img
                    src={camp.firstImageUrl}
                    alt={camp.facltNm}
                    style={{ width: "100%", height: "150px", objectFit: "cover" }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "150px",
                      backgroundColor: "#ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    등록된 이미지 없음
                  </div>
                )}
              </div>
            ))
          ) : (
            <div>캠핑장 정보를 불러오는 중입니다...</div>
          )}
        </div>
        <div style={{ textAlign: "center" }}>
          {generatePageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => pageNum !== "..." && setCurrentPage(pageNum)}
              style={{
                margin: "0 5px",
                padding: "5px 10px",
                backgroundColor: currentPage === pageNum ? "#007bff" : "#f0f0f0",
                color: currentPage === pageNum ? "#fff" : "#000",
                border: "1px solid #ddd",
                borderRadius: "3px",
                cursor: pageNum !== "..." ? "pointer" : "default",
              }}
              disabled={pageNum === "..."}
            >
              {pageNum}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Map;