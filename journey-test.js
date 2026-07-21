(function () {
  const JESUS_TOPIC_ID = "hanh-trinh-theo-dau-chan-chua-giesu";
  const EXODUS_TOPIC_ID = "hanh-trinh-xuat-hanh-cuoc-doi-cua-mo-se";
  const CREATION_TOPIC_ID = "chua-tao-dung-troi-dat";
  const STATIONS_TOPIC_ID = "14-chang-dang-thanh-gia";
  const MIRACLES_TOPIC_ID = "chua-lam-phep-la";
  const MAP_TYPE_JESUS = "jesus";
  const MAP_TYPE_EXODUS = "exodus";
  const MAP_TYPE_CREATION = "creation";
  const MAP_TYPE_STATIONS = "stations";
  const MAP_TYPE_MIRACLES = "miracles";
  const JESUS_MAP_IMAGE = "/assets/journey-jesus-map.png";
  const EXODUS_MAP_IMAGE = "/assets/journey-moses-exodus-map.png";
  const CREATION_MAP_IMAGE = "/assets/journey-creation-map.png";
  const STATIONS_MAP_IMAGE = "/assets/journey-stations-cross-map.png";
  const MIRACLES_MAP_IMAGE = "/assets/journey-miracles-map.png";
  const BAPTISM_STEP_NUMBER = 3;
  let BAPTISM_REWARD_POINTS = 50;

  let baptismChallenge = {
    title: "Ghép Dấu Chỉ Bên Sông Giođan",
    instruction: "Chọn đúng 3 dấu chỉ xuất hiện trong biến cố Chúa chịu phép rửa.",
    verse: "Đây là Con yêu dấu của Ta, Ta hài lòng về Người.",
    verseRef: "Mt 3,17",
    targets: [
      { signId: "water", label: "Nước", hint: "Dấu chỉ của phép rửa", reveal: "Nước sông Giođan" },
      { signId: "dove", label: "Thánh Thần", hint: "Ngự xuống trong hình chim bồ câu", reveal: "Chim bồ câu" },
      { signId: "voice", label: "Tiếng Chúa Cha", hint: "Lời xác nhận từ trời", reveal: "Tiếng từ trời" },
    ],
    options: [
      { id: "dove", label: "Chim bồ câu", text: "Thánh Thần ngự xuống", icon: "✦", correct: true },
      { id: "mountain", label: "Ngọn núi", text: "Không thuộc chặng này", icon: "△", correct: false },
      { id: "water", label: "Nước sông", text: "Dòng sông Giođan", icon: "≈", correct: true },
      { id: "temple", label: "Đền thờ", text: "Không thuộc chặng này", icon: "▥", correct: false },
      { id: "voice", label: "Tiếng từ trời", text: "Lời Chúa Cha phán", icon: "◌", correct: true },
    ],
  };
  let journeyChallenges = { [String(BAPTISM_STEP_NUMBER)]: baptismChallenge };
  let activeJourneyMilestones = [];
  let journeyTopicDetails = new Map();

  const jesusMilestones = [
    {
      number: 1,
      title: "Giáng Sinh",
      reference: "Lc 2,1-20",
      region: "Bêlem",
      scene: "nativity",
      x: 7,
      y: 34,
      story: "Chúa Giêsu sinh ra tại Bêlem trong cảnh đơn sơ, mở đầu Tin Mừng cứu độ cho nhân loại.",
      lesson: "Thiên Chúa đến gần con người bằng sự khiêm nhường và yêu thương.",
    },
    {
      number: 2,
      title: "Thời niên thiếu",
      reference: "Lc 2,41-52",
      region: "Nadarét",
      scene: "temple",
      x: 22,
      y: 35,
      story: "Chúa Giêsu lớn lên trong gia đình Thánh Gia và luôn hướng lòng về nhà Cha.",
      lesson: "Đời sống gia đình và sự vâng phục cũng là con đường nên thánh.",
    },
    {
      number: 3,
      title: "Chúa chịu phép rửa",
      reference: "Mt 3,13-17",
      region: "Sông Giođan",
      scene: "baptism",
      x: 37,
      y: 28,
      story: "Tại sông Giođan, Chúa Giêsu nhận phép rửa và bắt đầu bước vào sứ vụ công khai.",
      lesson: "Người môn đệ được mời gọi sống khiêm nhường và lắng nghe tiếng Chúa Cha.",
    },
    {
      number: 4,
      title: "Chúa chịu cám dỗ",
      reference: "Mt 4,1-11",
      region: "Hoang địa",
      scene: "desert",
      x: 55,
      y: 20,
      story: "Trong hoang địa, Chúa Giêsu chiến thắng cám dỗ bằng Lời Chúa và lòng trung thành.",
      lesson: "Lời Chúa là ánh sáng giúp ta đứng vững trước thử thách.",
    },
    {
      number: 5,
      title: "Bắt đầu rao giảng",
      reference: "Mc 1,14-15",
      region: "Galilê",
      scene: "preaching",
      x: 72,
      y: 22,
      story: "Chúa Giêsu loan báo Nước Thiên Chúa đã gần đến và mời gọi mọi người sám hối.",
      lesson: "Tin Mừng bắt đầu bằng một trái tim biết quay về với Thiên Chúa.",
    },
    {
      number: 6,
      title: "Gọi các môn đệ",
      reference: "Lc 5,1-11",
      region: "Biển hồ",
      scene: "boat",
      x: 84,
      y: 36,
      story: "Chúa gọi những người đánh cá bình thường trở nên môn đệ và người loan báo Tin Mừng.",
      lesson: "Chúa có thể dùng chính đời sống thường ngày của ta cho một sứ mạng lớn hơn.",
    },
    {
      number: 7,
      title: "Phép lạ đầu tiên",
      reference: "Ga 2,1-11",
      region: "Cana",
      scene: "cana",
      x: 10,
      y: 65,
      story: "Tại tiệc cưới Cana, Chúa Giêsu biến nước thành rượu theo lời chuyển cầu của Đức Maria.",
      lesson: "Hãy đến với Chúa bằng niềm tin và học thái độ lắng nghe của Mẹ Maria.",
    },
    {
      number: 8,
      title: "Giảng trên núi",
      reference: "Mt 5-7",
      region: "Galilê",
      scene: "mount",
      x: 28,
      y: 64,
      story: "Chúa dạy các Mối Phúc và con đường sống của người môn đệ.",
      lesson: "Hạnh phúc thật đến từ trái tim hiền lành, trong sạch và biết yêu thương.",
    },
    {
      number: 9,
      title: "Các phép lạ",
      reference: "Mc 6,30-44",
      region: "Galilê",
      scene: "miracle",
      x: 43,
      y: 66,
      story: "Chúa chữa lành, nuôi dân chúng và tỏ lòng thương xót với những ai đang thiếu thốn.",
      lesson: "Điều nhỏ bé được trao vào tay Chúa có thể trở thành ân phúc cho nhiều người.",
    },
    {
      number: 10,
      title: "Các dụ ngôn",
      reference: "Lc 15,1-32",
      region: "Samaria",
      scene: "parable",
      x: 58,
      y: 65,
      story: "Chúa dùng những câu chuyện gần gũi để mặc khải lòng thương xót của Thiên Chúa.",
      lesson: "Thiên Chúa luôn tìm kiếm và vui mừng khi người lạc bước trở về.",
    },
    {
      number: 11,
      title: "Chúa vào Giêrusalem",
      reference: "Mt 21,1-11",
      region: "Giêrusalem",
      scene: "jerusalem",
      x: 72,
      y: 66,
      story: "Dân chúng đón Chúa vào thành với cành lá và lời chúc tụng, mở đầu Tuần Thánh.",
      lesson: "Đón Chúa không chỉ bằng lời tung hô, mà bằng một đời sống trung thành.",
    },
    {
      number: 12,
      title: "Bữa Tiệc Ly",
      reference: "Lc 22,7-20",
      region: "Nhà Tiệc Ly",
      scene: "supper",
      x: 78,
      y: 82,
      story: "Chúa lập Bí tích Thánh Thể và trao ban chính mình cho các môn đệ.",
      lesson: "Tình yêu của Chúa là tình yêu trao hiến đến cùng.",
    },
    {
      number: 13,
      title: "Chúa cầu nguyện",
      reference: "Lc 22,39-46",
      region: "Ghếtsêmani",
      scene: "garden",
      x: 90,
      y: 82,
      story: "Trong vườn Ghếtsêmani, Chúa cầu nguyện và phó thác trước cuộc Thương Khó.",
      lesson: "Khi lo sợ, hãy cùng Chúa thưa: xin theo ý Cha.",
    },
    {
      number: 14,
      title: "Chúa chịu đóng đinh",
      reference: "Lc 23,26-49",
      region: "Golgotha",
      scene: "cross",
      x: 95,
      y: 64,
      story: "Chúa chịu đóng đinh trên thập giá và tha thứ cho những người làm hại Người.",
      lesson: "Thập giá là nơi tình yêu và lòng tha thứ chiến thắng hận thù.",
    },
    {
      number: 15,
      title: "Chúa Phục Sinh",
      reference: "Lc 24,1-12",
      region: "Mộ trống",
      scene: "resurrection",
      x: 95,
      y: 44,
      story: "Ngôi mộ trống loan báo niềm vui Phục Sinh: Chúa đã sống lại thật.",
      lesson: "Niềm hy vọng Kitô giáo bắt đầu từ ánh sáng Phục Sinh.",
    },
    {
      number: 16,
      title: "Chúa Thăng Thiên",
      reference: "Cv 1,9-11",
      region: "Núi Ôliu",
      scene: "ascension",
      x: 94,
      y: 25,
      story: "Chúa lên trời và trao sứ mạng làm chứng cho các môn đệ.",
      lesson: "Người môn đệ tiếp tục hành trình bằng việc loan báo Tin Mừng trong đời sống.",
    },
  ];

  const journeyMapNumberPositions = [
    { x: 29.5, y: 18.7 },
    { x: 54.8, y: 20.9 },
    { x: 79.6, y: 23.2 },
    { x: 37.1, y: 31.4 },
    { x: 70.5, y: 35.5 },
    { x: 42.1, y: 42.6 },
    { x: 70.1, y: 45.1 },
    { x: 38.3, y: 52.7 },
    { x: 68.6, y: 55.7 },
    { x: 43.1, y: 61.7 },
    { x: 35.5, y: 66.3 },
    { x: 70.7, y: 67.2 },
    { x: 76.8, y: 75.6 },
    { x: 32.8, y: 77.0 },
    { x: 58.7, y: 83.2 },
    { x: 49.0, y: 91.0 },
  ];

  const exodusMapNumberPositions = [
    { x: 22.5, y: 8.7 },
    { x: 25.5, y: 16.8 },
    { x: 19.6, y: 25.6 },
    { x: 52.0, y: 21.6 },
    { x: 76.5, y: 17.2 },
    { x: 81.7, y: 29.4 },
    { x: 82.9, y: 39.1 },
    { x: 13.3, y: 48.9 },
    { x: 34.0, y: 50.3 },
    { x: 57.7, y: 50.4 },
    { x: 48.6, y: 60.7 },
    { x: 27.8, y: 66.5 },
    { x: 19.4, y: 75.2 },
    { x: 48.8, y: 76.9 },
    { x: 73.1, y: 80.6 },
    { x: 52.3, y: 91.6 },
  ];

  const creationMapNumberPositions = [
    { x: 28.8, y: 8.3 },
    { x: 47.8, y: 17.7 },
    { x: 40.7, y: 29.4 },
    { x: 55.0, y: 41.6 },
    { x: 42.7, y: 53.0 },
    { x: 53.7, y: 64.0 },
    { x: 38.6, y: 76.8 },
  ];

  const stationsMapNumberPositions = [
    { x: 22.6, y: 9.5 },
    { x: 45.5, y: 15.9 },
    { x: 60.3, y: 23.0 },
    { x: 36.1, y: 29.4 },
    { x: 58.8, y: 36.0 },
    { x: 27.0, y: 43.2 },
    { x: 57.4, y: 46.0 },
    { x: 27.6, y: 53.1 },
    { x: 66.5, y: 58.1 },
    { x: 33.1, y: 63.2 },
    { x: 58.1, y: 66.9 },
    { x: 29.5, y: 73.0 },
    { x: 65.2, y: 77.9 },
    { x: 50.4, y: 91.3 },
  ];

  const miraclesMapNumberPositions = [
    { x: 26.3, y: 6.2 },
    { x: 48.3, y: 12.4 },
    { x: 64.4, y: 21.0 },
    { x: 27.6, y: 33.4 },
    { x: 57.8, y: 35.4 },
    { x: 23.4, y: 43.7 },
    { x: 47.1, y: 46.2 },
    { x: 79.3, y: 48.6 },
    { x: 23.5, y: 58.1 },
    { x: 69.7, y: 62.1 },
    { x: 15.9, y: 70.4 },
    { x: 48.2, y: 70.7 },
    { x: 77.0, y: 75.0 },
    { x: 49.0, y: 88.0 },
  ];

  const stationsMilestones = [
    {
      number: 1,
      title: "Chúa Giêsu bị kết án tử hình",
      reference: "Mt 27,22-26",
      region: "Dinh Philatô",
      story: "Chúa Giêsu, Đấng vô tội, đón nhận bản án bất công trong thinh lặng và phó thác.",
      lesson: "Xin cho con biết đứng về phía sự thật và không kết án người khác cách vội vàng.",
    },
    {
      number: 2,
      title: "Chúa Giêsu vác Thánh Giá",
      reference: "Ga 19,16-17",
      region: "Giêrusalem",
      story: "Chúa Giêsu vác lấy Thánh Giá, ôm trọn gánh nặng tội lỗi nhân loại bằng tình yêu.",
      lesson: "Xin cho con biết vác thập giá đời mình với lòng tin tưởng nơi Chúa.",
    },
    {
      number: 3,
      title: "Chúa Giêsu ngã xuống lần thứ nhất",
      reference: "Is 53,4-5",
      region: "Đường lên Gôgôtha",
      story: "Dưới sức nặng của Thánh Giá, Chúa ngã xuống nhưng lại đứng lên để tiếp tục hành trình cứu độ.",
      lesson: "Khi yếu đuối vấp ngã, xin cho con biết đứng dậy trong ơn Chúa.",
    },
    {
      number: 4,
      title: "Chúa Giêsu gặp Đức Mẹ",
      reference: "Lc 2,34-35",
      region: "Giêrusalem",
      story: "Trên đường khổ nạn, Chúa Giêsu gặp Mẹ Maria, người Mẹ âm thầm hiệp thông trong đau khổ của Con.",
      lesson: "Xin cho con biết ở lại bên người đau khổ bằng sự hiện diện yêu thương.",
    },
    {
      number: 5,
      title: "Ông Simôn thành Kyrênê giúp vác Thánh Giá",
      reference: "Mc 15,21",
      region: "Đường Thánh Giá",
      story: "Ông Simôn được mời gọi chia sẻ gánh nặng Thánh Giá với Chúa Giêsu.",
      lesson: "Xin cho con nhận ra Chúa nơi những người cần được nâng đỡ.",
    },
    {
      number: 6,
      title: "Bà Vêrônica lau mặt Chúa",
      reference: "Mt 25,40",
      region: "Giêrusalem",
      story: "Bà Vêrônica can đảm tiến đến lau khuôn mặt đau khổ của Chúa giữa đám đông.",
      lesson: "Một cử chỉ nhỏ vì yêu thương có thể phản chiếu khuôn mặt Chúa.",
    },
    {
      number: 7,
      title: "Chúa Giêsu ngã xuống lần thứ hai",
      reference: "Tv 38,7-9",
      region: "Đường lên Núi Sọ",
      story: "Chúa lại ngã xuống, nhưng tình yêu dành cho nhân loại giúp Người tiếp tục bước đi.",
      lesson: "Xin cho con đừng nản lòng khi phải bắt đầu lại nhiều lần.",
    },
    {
      number: 8,
      title: "Chúa Giêsu an ủi các phụ nữ thành Giêrusalem",
      reference: "Lc 23,27-31",
      region: "Giêrusalem",
      story: "Giữa đau khổ, Chúa vẫn hướng lòng đến những người khóc thương và mời gọi họ hoán cải.",
      lesson: "Xin cho con biết biến nước mắt thành lời cầu nguyện và đổi mới đời sống.",
    },
    {
      number: 9,
      title: "Chúa Giêsu ngã xuống lần thứ ba",
      reference: "Pl 2,6-8",
      region: "Gần Đồi Gôgôtha",
      story: "Chúa ngã xuống lần nữa, chạm đến tận cùng sự yếu đuối của kiếp người.",
      lesson: "Không có vực sâu nào mà tình yêu Chúa không thể bước xuống để nâng con lên.",
    },
    {
      number: 10,
      title: "Chúa Giêsu bị lột áo",
      reference: "Ga 19,23-24",
      region: "Đồi Gôgôtha",
      story: "Chúa Giêsu bị tước đoạt áo quần, chịu sỉ nhục để mặc lại cho con người phẩm giá đã mất.",
      lesson: "Xin cho con biết tôn trọng phẩm giá của mọi người, nhất là người bị tổn thương.",
    },
    {
      number: 11,
      title: "Chúa Giêsu chịu đóng đinh vào Thập Giá",
      reference: "Lc 23,33-34",
      region: "Đồi Gôgôtha",
      story: "Chúa Giêsu bị đóng đinh vào Thập Giá và vẫn cầu xin ơn tha thứ cho những kẻ làm hại Người.",
      lesson: "Tha thứ là con đường khó, nhưng là con đường của Chúa.",
    },
    {
      number: 12,
      title: "Chúa Giêsu chết trên Thập Giá",
      reference: "Ga 19,28-30",
      region: "Đồi Gôgôtha",
      story: "Chúa Giêsu trao phó thần khí trong tay Chúa Cha, hoàn tất hiến lễ tình yêu.",
      lesson: "Tình yêu thật là tình yêu trao ban đến cùng.",
    },
    {
      number: 13,
      title: "Chúa Giêsu được tháo xuống khỏi Thập Giá",
      reference: "Ga 19,38-40",
      region: "Dưới chân Thập Giá",
      story: "Thân xác Chúa được tháo xuống và trao vào vòng tay những người yêu mến Người.",
      lesson: "Xin cho con biết đón nhận những mất mát trong hy vọng Phục Sinh.",
    },
    {
      number: 14,
      title: "Chúa Giêsu được an táng trong mồ",
      reference: "Mt 27,57-61",
      region: "Mộ đá",
      story: "Chúa Giêsu được đặt trong mồ, và trong thinh lặng của ngày thứ bảy, niềm hy vọng đang được chuẩn bị.",
      lesson: "Ngay cả khi mọi sự dường như kết thúc, Thiên Chúa vẫn đang mở đường cho sự sống mới.",
    },
  ];

  const creationMilestones = [
    {
      number: 1,
      title: "Ngày 1 - Chúa tạo ra ánh sáng",
      reference: "St 1,1-5",
      region: "Hư vô và hỗn độn",
      story: "Thiên Chúa phán: <strong>Hãy có ánh sáng</strong>, và ánh sáng xuất hiện, mở đầu công trình tạo dựng.",
      lesson: "Ánh sáng của Chúa xua tan tối tăm và khởi đầu mọi sự trong trật tự yêu thương.",
    },
    {
      number: 2,
      title: "Ngày 2 - Chúa tạo bầu trời và phân rẽ nước",
      reference: "St 1,6-8",
      region: "Bầu trời",
      story: "Thiên Chúa tạo vòm trời để phân rẽ nước bên trên và nước bên dưới, đặt nền cho không gian của sự sống.",
      lesson: "Tạo dựng không hỗn loạn; Thiên Chúa đặt mọi sự vào trật tự và hài hòa.",
    },
    {
      number: 3,
      title: "Ngày 3 - Chúa tạo đất khô, biển và cây cối",
      reference: "St 1,9-13",
      region: "Đất khô và biển lớn",
      story: "Nước tụ lại thành biển, đất khô xuất hiện, và cây cối sinh hoa trái theo lệnh truyền của Thiên Chúa.",
      lesson: "Sự sống nảy sinh từ lời Chúa và được mời gọi sinh hoa trái.",
    },
    {
      number: 4,
      title: "Ngày 4 - Chúa tạo mặt trời, mặt trăng và các vì sao",
      reference: "St 1,14-19",
      region: "Bầu trời",
      story: "Thiên Chúa đặt các nguồn sáng trên bầu trời để phân định ngày đêm, mùa màng và thời gian.",
      lesson: "Thời gian cũng là quà tặng, để con người sống trong nhịp điệu của Thiên Chúa.",
    },
    {
      number: 5,
      title: "Ngày 5 - Chúa tạo các loài cá và chim trời",
      reference: "St 1,20-23",
      region: "Biển lớn và bầu trời",
      story: "Biển cả đầy sinh vật và bầu trời đầy chim bay; Thiên Chúa chúc phúc cho chúng sinh sôi nảy nở.",
      lesson: "Sự phong phú của tạo vật kể lại lòng quảng đại của Đấng Tạo Hóa.",
    },
    {
      number: 6,
      title: "Ngày 6 - Chúa tạo thú vật trên đất",
      reference: "St 1,24-25",
      region: "Đất khô",
      story: "Thiên Chúa tạo nên các loài vật trên đất, mỗi loài theo giống của mình.",
      lesson: "Mỗi thụ tạo đều có chỗ đứng trong công trình tốt lành của Thiên Chúa.",
    },
    {
      number: 7,
      title: "Ngày 7 - Chúa tạo nên con người và nghỉ ngơi",
      reference: "St 1,26-31; 2,1-3",
      region: "Vườn Ê-đen",
      story: "Thiên Chúa tạo dựng con người theo hình ảnh Người, trao phó tạo thành cho con người chăm sóc, rồi thánh hóa ngày nghỉ.",
      lesson: "Con người được mời gọi sống như hình ảnh Thiên Chúa: yêu thương, chăm sóc và biết nghỉ ngơi trong Chúa.",
    },
  ];

  const miraclesMilestones = [
    {
      number: 1,
      title: "Chúa hóa nước thành rượu",
      reference: "Ga 2,1-11",
      region: "Cana",
      story: "Tại tiệc cưới Cana, Chúa Giêsu hóa nước thành rượu, bày tỏ vinh quang của Người và khơi dậy niềm tin nơi các môn đệ.",
      lesson: "Khi trao những thiếu thốn nhỏ bé cho Chúa, Người có thể biến chúng thành niềm vui dồi dào.",
    },
    {
      number: 2,
      title: "Chúa chữa con quan ở Caphácnaum",
      reference: "Ga 4,46-54",
      region: "Caphácnaum",
      story: "Một viên quan xin Chúa cứu con mình; ông tin vào lời Chúa và người con được chữa lành.",
      lesson: "Đức tin trưởng thành khi ta dám bước đi dựa trên lời Chúa, ngay cả trước khi thấy dấu chỉ.",
    },
    {
      number: 3,
      title: "Chúa chữa người tê bại",
      reference: "Mc 2,1-12",
      region: "Caphácnaum",
      story: "Chúa Giêsu tha tội và chữa lành người tê bại được bạn hữu khiêng đến với Người.",
      lesson: "Tình yêu liên đới có thể mở đường cho người khác gặp được lòng thương xót của Chúa.",
    },
    {
      number: 4,
      title: "Chúa chữa người mù bẩm sinh",
      reference: "Ga 9,1-7",
      region: "Giêrusalem",
      story: "Chúa Giêsu mở mắt cho người mù từ thuở mới sinh, để công trình của Thiên Chúa được tỏ hiện.",
      lesson: "Ánh sáng của Chúa không chỉ chữa đôi mắt, mà còn mở lòng ta nhận ra sự thật.",
    },
    {
      number: 5,
      title: "Chúa làm yên biển động",
      reference: "Mc 4,35-41",
      region: "Hồ Galilê",
      story: "Giữa cơn bão, Chúa Giêsu truyền cho gió biển im lặng và củng cố niềm tin của các môn đệ.",
      lesson: "Trong những cơn bão của đời sống, hãy nhớ Chúa vẫn hiện diện trong con thuyền của ta.",
    },
    {
      number: 6,
      title: "Chúa chữa người bệnh bại tay",
      reference: "Mc 3,1-6",
      region: "Hội đường",
      story: "Chúa chữa lành người bại tay trong ngày sabát, đặt lòng thương xót trên sự khô cứng của luật lệ.",
      lesson: "Việc lành không nên bị trì hoãn khi trước mặt ta là một người đang cần được nâng đỡ.",
    },
    {
      number: 7,
      title: "Chúa cho 5.000 người ăn",
      reference: "Mc 6,30-44",
      region: "Galilê",
      story: "Từ năm chiếc bánh và hai con cá, Chúa nuôi đám đông và còn dư dật.",
      lesson: "Điều ít ỏi được trao bằng lòng quảng đại có thể trở thành ân phúc cho nhiều người.",
    },
    {
      number: 8,
      title: "Chúa đi trên mặt nước",
      reference: "Mt 14,22-33",
      region: "Hồ Galilê",
      story: "Chúa Giêsu đi trên mặt nước đến với các môn đệ đang hoảng sợ giữa đêm tối.",
      lesson: "Khi nhìn vào Chúa hơn là sóng gió, ta học được lòng can đảm của đức tin.",
    },
    {
      number: 9,
      title: "Chúa chữa người mù tại Giêricô",
      reference: "Mc 10,46-52",
      region: "Giêricô",
      story: "Người mù kêu xin lòng thương xót và được Chúa cho thấy, rồi đi theo Người trên đường.",
      lesson: "Lời cầu xin chân thành có thể trở thành khởi đầu của một hành trình theo Chúa.",
    },
    {
      number: 10,
      title: "Chúa chữa mười người phong hủi",
      reference: "Lc 17,11-19",
      region: "Samaria và Galilê",
      story: "Mười người phong hủi được chữa lành, nhưng chỉ một người trở lại tạ ơn Chúa.",
      lesson: "Ơn lành đạt đến chiều sâu khi ta biết quay lại sống lòng biết ơn.",
    },
    {
      number: 11,
      title: "Chúa cho La-da-rô sống lại",
      reference: "Ga 11,1-44",
      region: "Bêtania",
      story: "Trước mộ La-da-rô, Chúa Giêsu gọi ông ra khỏi sự chết và tỏ mình là sự sống lại.",
      lesson: "Không bóng tối nào vượt quá tiếng gọi sự sống của Chúa.",
    },
    {
      number: 12,
      title: "Chúa chữa người trẻ bị quỷ ám",
      reference: "Mc 9,14-29",
      region: "Galilê",
      story: "Chúa giải thoát một người trẻ khỏi quyền lực sự dữ và mời gọi các môn đệ cầu nguyện sâu xa hơn.",
      lesson: "Có những cuộc chiến thiêng liêng cần được nâng đỡ bằng cầu nguyện và lòng tin bền bỉ.",
    },
    {
      number: 13,
      title: "Chúa chữa tai Malkhus bị cắt",
      reference: "Lc 22,50-51",
      region: "Vườn Ghếtsêmani",
      story: "Trong giờ bị bắt, Chúa Giêsu vẫn chữa lành người bị thương, đáp lại bạo lực bằng lòng thương xót.",
      lesson: "Người môn đệ của Chúa được mời gọi phá vỡ vòng xoáy bạo lực bằng tình yêu.",
    },
    {
      number: 14,
      title: "Chúa chữa người mù Báctimê",
      reference: "Mc 10,46-52",
      region: "Giêricô",
      story: "Báctimê kêu lên với Chúa, được chữa lành và lập tức bước theo Người.",
      lesson: "Khi Chúa mở mắt tâm hồn, ta được mời đứng dậy và đi theo Người.",
    },
  ];

  const exodusMilestones = [
    {
      number: 1,
      title: "Mô-sê được sinh ra trong dân Israel",
      reference: "Xh 2,1-2",
      region: "Ai Cập",
      story: "Giữa cảnh dân Israel bị áp bức, Mô-sê chào đời như một dấu chỉ Thiên Chúa vẫn âm thầm gìn giữ dân Người.",
      lesson: "Thiên Chúa có thể khởi đầu kế hoạch cứu độ ngay trong những hoàn cảnh mong manh nhất.",
    },
    {
      number: 2,
      title: "Mô-sê được đặt trong chiếc giỏ",
      reference: "Xh 2,3-4",
      region: "Sông Nil",
      story: "Mẹ của Mô-sê đặt con trong chiếc giỏ giữa dòng sông, phó thác sự sống của con cho lòng thương xót của Thiên Chúa.",
      lesson: "Đức tin đôi khi là dám trao điều quý nhất vào tay Chúa.",
    },
    {
      number: 3,
      title: "Mô-sê được công chúa Pha-ra-ô nhận nuôi",
      reference: "Xh 2,5-10",
      region: "Ai Cập",
      story: "Mô-sê được cứu khỏi dòng nước và lớn lên trong cung điện Ai Cập, chuẩn bị cho một sứ mạng vượt quá điều ông có thể hiểu lúc ấy.",
      lesson: "Thiên Chúa có thể dùng cả những ngả đường bất ngờ để chuẩn bị người phục vụ Người.",
    },
    {
      number: 4,
      title: "Mô-sê bỏ Ai Cập, đến Midian",
      reference: "Xh 2,11-15",
      region: "Midian",
      story: "Sau biến cố tại Ai Cập, Mô-sê rời bỏ nơi quen thuộc và bước vào một giai đoạn ẩn mình trong sa mạc.",
      lesson: "Những năm tháng âm thầm cũng có thể là trường học của Thiên Chúa.",
    },
    {
      number: 5,
      title: "Mô-sê chăn chiên ở Midian",
      reference: "Xh 2,16-22",
      region: "Midian",
      story: "Mô-sê sống đời mục tử nơi Midian, học sự kiên nhẫn, chăm sóc và lắng nghe giữa nhịp sống bình dị.",
      lesson: "Trước khi dẫn dắt dân Chúa, người phục vụ cần học biết chăm sóc những điều nhỏ bé.",
    },
    {
      number: 6,
      title: "Mô-sê gặp Thiên Chúa trong bụi gai bốc cháy",
      reference: "Xh 3,1-6",
      region: "Núi của Thiên Chúa",
      story: "Thiên Chúa gọi Mô-sê từ bụi gai cháy mà không tàn, mặc khải sự hiện diện thánh thiêng của Người.",
      lesson: "Khi Thiên Chúa gọi, nơi bình thường cũng trở thành đất thánh.",
    },
    {
      number: 7,
      title: "Thiên Chúa sai Mô-sê trở về Ai Cập",
      reference: "Xh 3,7-12",
      region: "Midian",
      story: "Thiên Chúa sai Mô-sê trở về để giải thoát dân Người, dù Mô-sê còn sợ hãi và thấy mình yếu đuối.",
      lesson: "Ơn gọi không dựa trên sự tự tin của ta, nhưng trên lời hứa: Chúa ở cùng ta.",
    },
    {
      number: 8,
      title: "Mô-sê và A-ha-ron đến gặp Pha-ra-ô",
      reference: "Xh 5,1-5",
      region: "Ai Cập",
      story: "Mô-sê và A-ha-ron can đảm đứng trước Pha-ra-ô để xin cho dân Israel được ra đi thờ phượng Thiên Chúa.",
      lesson: "Lòng can đảm thiêng liêng bắt đầu bằng việc nói lời sự thật trước quyền lực.",
    },
    {
      number: 9,
      title: "Mười tai ương trên Ai Cập",
      reference: "Xh 7-12",
      region: "Ai Cập",
      story: "Qua các tai ương, Thiên Chúa tỏ quyền năng và dẫn dân Người tiến gần đến ngày giải thoát.",
      lesson: "Thiên Chúa không bỏ rơi dân bị áp bức, và quyền năng Người lớn hơn mọi xiềng xích.",
    },
    {
      number: 10,
      title: "Vượt qua Biển Đỏ",
      reference: "Xh 14,21-31",
      region: "Biển Đỏ",
      story: "Biển Đỏ mở ra cho dân Israel đi qua, còn quân Ai Cập bị chặn lại sau lưng họ.",
      lesson: "Khi tưởng như hết đường, Thiên Chúa vẫn có thể mở một con đường mới.",
    },
    {
      number: 11,
      title: "Mô-sê dẫn dân Israel vào hoang địa",
      reference: "Xh 15,22-27",
      region: "Hoang địa",
      story: "Sau khi vượt biển, dân Israel bước vào hoang địa, nơi họ học tin tưởng vào sự quan phòng từng ngày.",
      lesson: "Tự do thật cần được nuôi dưỡng bằng lòng tín thác.",
    },
    {
      number: 12,
      title: "Nước từ tảng đá ở Massah và Meriba",
      reference: "Xh 17,1-7",
      region: "Massah và Meriba",
      story: "Khi dân khát nước, Thiên Chúa cho nước chảy ra từ tảng đá để gìn giữ họ trong sa mạc.",
      lesson: "Chúa biết cơn khát của dân Người và ban điều cần thiết đúng lúc.",
    },
    {
      number: 13,
      title: "Mô-sê chiến thắng A-ma-léc",
      reference: "Xh 17,8-16",
      region: "Rơphidim",
      story: "Khi Mô-sê giơ tay cầu nguyện, dân Israel được sức mạnh để chiến thắng A-ma-léc.",
      lesson: "Chiến thắng của dân Chúa được nâng đỡ bằng lời cầu nguyện bền bỉ.",
    },
    {
      number: 14,
      title: "Nhận Mười Điều Răn trên núi Sinai",
      reference: "Xh 20,1-17",
      region: "Núi Sinai",
      story: "Thiên Chúa ban Mười Điều Răn như giao ước yêu thương, giúp dân sống tự do trong đường lối Người.",
      lesson: "Luật Chúa không trói buộc, nhưng gìn giữ con người trong tình yêu và sự sống.",
    },
    {
      number: 15,
      title: "Dựng Lều Hội Ngộ",
      reference: "Xh 40,1-38",
      region: "Lều Hội Ngộ",
      story: "Dân Israel dựng Lều Hội Ngộ, dấu chỉ Thiên Chúa hiện diện giữa dân trên hành trình.",
      lesson: "Giữa mọi cuộc lữ hành, điều quan trọng nhất là để Chúa ở trung tâm.",
    },
    {
      number: 16,
      title: "Mô-sê nhìn thấy Đất Hứa",
      reference: "Đnl 34,1-4",
      region: "Đất Hứa",
      story: "Từ núi Nơvô, Mô-sê nhìn thấy Đất Hứa, khép lại hành trình trung thành trong tay Thiên Chúa.",
      lesson: "Người phục vụ trung tín trao kết quả cuối cùng cho Thiên Chúa.",
    },
  ];

  exodusMilestones.forEach((step, index) => {
    Object.assign(step, exodusMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });

  creationMilestones.forEach((step, index) => {
    Object.assign(step, creationMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });

  stationsMilestones.forEach((step, index) => {
    Object.assign(step, stationsMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });

  miraclesMilestones.forEach((step, index) => {
    Object.assign(step, miraclesMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });

  jesusMilestones.forEach((step, index) => {
    Object.assign(step, journeyMapNumberPositions[index] || { x: 50, y: 10 + index * 5 });
  });
  activeJourneyMilestones = jesusMilestones;
  let activeJourneyMapImage = JESUS_MAP_IMAGE;
  let topics = [];

  const progress = {
    faithPoints: 850,
    fragments: 3,
    totalFragments: 12,
    badges: 1,
    completed: new Set([1, 2]),
    unlocked: new Set([3]),
  };

  const state = {
    search: "",
    sort: "default",
    page: 1,
    pageSize: 12,
    selectedStepNumber: BAPTISM_STEP_NUMBER,
    detailStepNumber: null,
    activeView: "map",
    baptismSelectedSigns: new Set(),
    baptismMessage: "",
    baptismTone: "info",
    baptismCompleted: false,
    baptismRewarded: false,
    activeChallengeNumber: BAPTISM_STEP_NUMBER,
    rewardedSteps: new Set(),
  };

  const picker = document.querySelector(".journey-set-picker");
  const game = document.querySelector("#journeyGame");
  const gameRoot = document.querySelector("#journeyGameRoot");
  const grid = document.querySelector("#journeyTopicGrid");
  const searchInput = document.querySelector("#journeySearch");
  const sortSelect = document.querySelector("#journeySort");
  const pagination = document.querySelector("#journeyPagination");

  function escapeAttr(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function escapeHtml(value) {
    return escapeAttr(value);
  }

  function renderAdminHtml(value) {
    return String(value || "");
  }

  function mapTypeFromText(value) {
    const normalized = normalizeText(value).replace(/[-_]+/g, " ");
    if (!normalized) return "";
    if (
      normalized.includes(MAP_TYPE_EXODUS) ||
      normalized.includes("xuat hanh") ||
      normalized.includes("mo se") ||
      normalized.includes("mose") ||
      normalized.includes("moses")
    ) {
      return MAP_TYPE_EXODUS;
    }
    if (
      normalized.includes(MAP_TYPE_CREATION) ||
      normalized.includes("chua tao dung troi dat") ||
      normalized.includes("tao dung") ||
      normalized.includes("sang the")
    ) {
      return MAP_TYPE_CREATION;
    }
    if (
      normalized.includes(MAP_TYPE_STATIONS) ||
      normalized.includes("14 chang dang thanh gia") ||
      normalized.includes("14 chan dang thanh gia") ||
      normalized.includes("dang thanh gia") ||
      normalized.includes("stations") ||
      normalized.includes("cross")
    ) {
      return MAP_TYPE_STATIONS;
    }
    if (
      normalized.includes(MAP_TYPE_MIRACLES) ||
      normalized.includes("chua lam phep la") ||
      normalized.includes("cac phep la") ||
      normalized.includes("phep la")
    ) {
      return MAP_TYPE_MIRACLES;
    }
    if (
      normalized.includes(MAP_TYPE_JESUS) ||
      normalized.includes("chua giesu") ||
      normalized.includes("chua gi esu") ||
      normalized.includes("dau chan chua")
    ) {
      return MAP_TYPE_JESUS;
    }
    return "";
  }

  function journeyMapTypeForTopic(topic = {}) {
    const explicitType = mapTypeFromText(topic.mapType || topic.mapKey || topic.mapId || "");
    if (explicitType) return explicitType;

    const idType = mapTypeFromText(topic.id || "");
    if (idType) return idType;

    const imageType = mapTypeFromText(topic.mapImageUrl || "");
    if (imageType) return imageType;

    return mapTypeFromText(topic.title || "") || MAP_TYPE_JESUS;
  }

  function isExodusTopic(topic = {}) {
    return journeyMapTypeForTopic(topic) === MAP_TYPE_EXODUS;
  }

  function isCreationTopic(topic = {}) {
    return journeyMapTypeForTopic(topic) === MAP_TYPE_CREATION;
  }

  function isStationsTopic(topic = {}) {
    return journeyMapTypeForTopic(topic) === MAP_TYPE_STATIONS;
  }

  function isMiraclesTopic(topic = {}) {
    return journeyMapTypeForTopic(topic) === MAP_TYPE_MIRACLES;
  }

  function journeyPositionsForTopic(topic) {
    if (isMiraclesTopic(topic)) return miraclesMapNumberPositions;
    if (isStationsTopic(topic)) return stationsMapNumberPositions;
    if (isCreationTopic(topic)) return creationMapNumberPositions;
    return isExodusTopic(topic) ? exodusMapNumberPositions : journeyMapNumberPositions;
  }

  function journeyMapImageForTopic(topic) {
    const configuredImage = String(topic?.mapImageUrl || "").trim();
    if (configuredImage) return configuredImage;
    if (isMiraclesTopic(topic)) return MIRACLES_MAP_IMAGE;
    if (isStationsTopic(topic)) return STATIONS_MAP_IMAGE;
    if (isCreationTopic(topic)) return CREATION_MAP_IMAGE;
    return isExodusTopic(topic) ? EXODUS_MAP_IMAGE : JESUS_MAP_IMAGE;
  }

  function fallbackMilestonesForTopic(topic) {
    if (isMiraclesTopic(topic)) return miraclesMilestones;
    if (isStationsTopic(topic)) return stationsMilestones;
    if (isCreationTopic(topic)) return creationMilestones;
    return isExodusTopic(topic) ? exodusMilestones : [];
  }

  function mergeJourneyMilestones(rawMilestones, fallbackMilestones, positions) {
    const rawList = Array.isArray(rawMilestones) ? rawMilestones : [];
    const rawByNumber = new Map(
      rawList
        .map((milestone, index) => [Number(milestone?.number || index + 1), milestone])
        .filter(([number]) => Number.isFinite(number))
    );
    const source = fallbackMilestones.length
      ? fallbackMilestones
          .map((fallbackMilestone) => ({ ...fallbackMilestone, ...(rawByNumber.get(Number(fallbackMilestone.number)) || {}) }))
          .concat(rawList.filter((milestone, index) => !fallbackMilestones.some((fallbackMilestone) => fallbackMilestone.number === Number(milestone?.number || index + 1))))
      : rawList;
    return source.map((milestone, milestoneIndex) => {
      const number = Number(milestone?.number || milestoneIndex + 1);
      const fallback = fallbackMilestones.find((item) => item.number === number) || {};
      const position = positions[number - 1] || positions[milestoneIndex] || { x: 50, y: 10 + milestoneIndex * 5 };
      return {
        number,
        title: String(milestone?.title || fallback.title || `Cột mốc ${number}`).trim(),
        reference: String(milestone?.reference || fallback.reference || "").trim(),
        region: String(milestone?.region || fallback.region || "").trim(),
        scene: String(milestone?.scene || fallback.scene || "").trim(),
        story: String(milestone?.story || fallback.story || "").trim(),
        lesson: String(milestone?.lesson || fallback.lesson || "").trim(),
        cardImageUrl: String(milestone?.cardImageUrl || fallback.cardImageUrl || "").trim(),
        x: fallbackMilestones.length ? position.x : Number.isFinite(Number(milestone?.x)) ? Number(milestone.x) : position.x,
        y: fallbackMilestones.length ? position.y : Number.isFinite(Number(milestone?.y)) ? Number(milestone.y) : position.y,
      };
    });
  }

  function normalizeJourneyTopicFromSettings(topic, index) {
    const fallback = topics.find((item) => item.id === topic?.id) || {};
    const topicShell = { ...fallback, ...topic };
    const mapType = journeyMapTypeForTopic(topicShell);
    const stableTopicShell = { ...topicShell, mapType };
    const fallbackMilestones = fallbackMilestonesForTopic(stableTopicShell);
    const milestones = mergeJourneyMilestones(topic?.milestones, fallbackMilestones, journeyPositionsForTopic(stableTopicShell));
    return {
      id: String(topic?.id || fallback.id || `journey-topic-${index + 1}`).trim(),
      title: String(topic?.title || fallback.title || `Chủ đề ${index + 1}`).trim(),
      description: String(topic?.description || fallback.description || "").trim(),
      label: String(topic?.label || fallback.label || "").trim(),
      enabled: topic?.enabled !== false,
      pickerImageUrl: String(topic?.pickerImageUrl || "").trim(),
      mapType,
      mapImageUrl: journeyMapImageForTopic(stableTopicShell),
      steps: milestones.length || fallback.steps || 0,
      milestones,
      challenges: topic?.challenges && typeof topic.challenges === "object" ? topic.challenges : {},
    };
  }

  function applyJourneyBibleSettings(settings) {
    const configuredTopics = Array.isArray(settings?.topics)
      ? settings.topics.map(normalizeJourneyTopicFromSettings).filter((topic) => topic.id)
      : [];
    if (!configuredTopics.length) return;

    journeyTopicDetails = new Map(configuredTopics.map((topic) => [topic.id, topic]));

    const jesusTopic = configuredTopics.find((topic) => topic.id === JESUS_TOPIC_ID);
    if (jesusTopic?.milestones?.length) {
      jesusTopic.milestones.forEach((milestone) => {
        const number = Number(milestone?.number);
        if (!Number.isFinite(number)) return;
        const existing = jesusMilestones.find((step) => step.number === number);
        const nextValues = {
          title: String(milestone.title || existing?.title || `Cột mốc ${number}`).trim(),
          reference: String(milestone.reference || existing?.reference || "").trim(),
          region: String(milestone.region || existing?.region || "").trim(),
          story: String(milestone.story || existing?.story || "").trim(),
          lesson: String(milestone.lesson || existing?.lesson || "").trim(),
          scene: String(milestone.scene || existing?.scene || "").trim(),
          cardImageUrl: String(milestone.cardImageUrl || existing?.cardImageUrl || "").trim(),
        };
        const x = Number(milestone.x);
        const y = Number(milestone.y);
        if (Number.isFinite(x)) nextValues.x = x;
        if (Number.isFinite(y)) nextValues.y = y;
        if (existing) {
          Object.assign(existing, nextValues);
        } else {
          jesusMilestones.push({ number, ...nextValues });
        }
      });
      jesusMilestones.sort((a, b) => a.number - b.number);
    }

    const baptismSettings = jesusTopic?.challenges?.[String(BAPTISM_STEP_NUMBER)] || jesusTopic?.challenges?.[BAPTISM_STEP_NUMBER];
    if (baptismSettings && typeof baptismSettings === "object") {
      baptismChallenge = {
        ...baptismChallenge,
        ...baptismSettings,
        title: String(baptismSettings.title || baptismChallenge.title).trim(),
        instruction: String(baptismSettings.instruction || baptismChallenge.instruction).trim(),
        verse: String(baptismSettings.verse || baptismChallenge.verse).trim(),
        verseRef: String(baptismSettings.verseRef || baptismChallenge.verseRef).trim(),
        sceneImageUrl: String(baptismSettings.sceneImageUrl || "").trim(),
        targets: Array.isArray(baptismSettings.targets) && baptismSettings.targets.length ? baptismSettings.targets : baptismChallenge.targets,
        options: Array.isArray(baptismSettings.options) && baptismSettings.options.length ? baptismSettings.options : baptismChallenge.options,
      };
      const rewardPoints = Number(baptismSettings.rewardPoints);
      if (Number.isFinite(rewardPoints) && rewardPoints >= 0) BAPTISM_REWARD_POINTS = rewardPoints;
    }

    journeyChallenges = { [String(BAPTISM_STEP_NUMBER)]: baptismChallenge };
    if (jesusTopic?.challenges && typeof jesusTopic.challenges === "object") {
      Object.entries(jesusTopic.challenges).forEach(([key, value]) => {
        const number = Number(key);
        if (!Number.isFinite(number) || !value || typeof value !== "object") return;
        const base = number === BAPTISM_STEP_NUMBER ? baptismChallenge : {};
        const normalized = {
          ...base,
          ...value,
          title: String(value.title || base.title || `Thử thách cột mốc ${number}`).trim(),
          instruction: String(value.instruction || base.instruction || "Hãy hoàn thành thử thách của cột mốc này.").trim(),
          verse: String(value.verse || base.verse || "").trim(),
          verseRef: String(value.verseRef || base.verseRef || "").trim(),
          sceneImageUrl: String(value.sceneImageUrl || base.sceneImageUrl || "").trim(),
          rewardPoints: Number.isFinite(Number(value.rewardPoints)) ? Number(value.rewardPoints) : Number(base.rewardPoints || BAPTISM_REWARD_POINTS),
          targets: Array.isArray(value.targets) ? value.targets : Array.isArray(base.targets) ? base.targets : [],
          options: Array.isArray(value.options) ? value.options : Array.isArray(base.options) ? base.options : [],
        };
        journeyChallenges[String(number)] = normalized;
      });
      baptismChallenge = journeyChallenges[String(BAPTISM_STEP_NUMBER)] || baptismChallenge;
      BAPTISM_REWARD_POINTS = Number(baptismChallenge.rewardPoints || BAPTISM_REWARD_POINTS) || BAPTISM_REWARD_POINTS;
    }

    topics = configuredTopics.map((topic) => ({
      id: topic.id,
      title: topic.title,
      description: topic.description,
      label: topic.label,
      enabled: topic.enabled,
      pickerImageUrl: topic.pickerImageUrl,
      mapType: topic.mapType,
      mapImageUrl: topic.mapImageUrl,
      steps: topic.milestones.length || (topic.id === JESUS_TOPIC_ID ? jesusMilestones.length : topic.steps),
    }));
  }

  async function loadJourneyBibleSettings() {
    if (typeof getJourneyBibleSettings !== "function") return;
    try {
      const settings = await getJourneyBibleSettings();
      applyJourneyBibleSettings(settings);
    } catch (error) {
      console.warn("Không thể tải cấu hình Hành trình Kinh Thánh", error);
    }
  }
  function normalizeText(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase();
  }

  function getFilteredTopics() {
    const keyword = normalizeText(state.search);
    const filtered = topics.filter((topic) =>
      normalizeText(`${topic.title} ${topic.description} ${topic.label}`).includes(keyword)
    );

    if (state.sort === "title-asc") {
      filtered.sort((a, b) => a.title.localeCompare(b.title, "vi"));
    } else if (state.sort === "title-desc") {
      filtered.sort((a, b) => b.title.localeCompare(a.title, "vi"));
    } else if (state.sort === "steps-desc") {
      filtered.sort((a, b) => b.steps - a.steps);
    } else if (state.sort === "steps-asc") {
      filtered.sort((a, b) => a.steps - b.steps);
    }

    return filtered;
  }

  function getStepStatus(step) {
    if (progress.completed.has(step.number)) return "completed";
    if (progress.unlocked.has(step.number)) return "available";
    if (step.number <= 12) return "upcoming";
    return "locked";
  }

  function statusText(status) {
    return {
      completed: "Đã hoàn thành",
      available: "Có thể khám phá",
      upcoming: "Sắp mở khóa",
      locked: "Chưa mở khóa",
    }[status] || "Chưa mở khóa";
  }

  function getChallengeForStep(stepNumber) {
    const step = activeJourneyMilestones.find((item) => item.number === stepNumber);
    const challenge = journeyChallenges[String(stepNumber)] || {};
    return {
      ...challenge,
      title: String(challenge.title || `Thử thách cột mốc ${stepNumber}`).trim(),
      instruction: String(challenge.instruction || "Hãy hoàn thành thử thách của cột mốc này.").trim(),
      verse: String(challenge.verse || step?.lesson || "").trim(),
      verseRef: String(challenge.verseRef || step?.reference || "").trim(),
      sceneImageUrl: String(challenge.sceneImageUrl || "").trim(),
      rewardPoints: Number.isFinite(Number(challenge.rewardPoints)) ? Number(challenge.rewardPoints) : BAPTISM_REWARD_POINTS,
      targets: Array.isArray(challenge.targets) ? challenge.targets : [],
      options: Array.isArray(challenge.options) ? challenge.options : [],
    };
  }

  function isBaptismChallengeComplete(challenge = getChallengeForStep(state.activeChallengeNumber)) {
    return challenge.targets.length > 0 && challenge.targets.every((target) => state.baptismSelectedSigns.has(target.signId));
  }

  function completeBaptismChallenge(challenge = getChallengeForStep(state.activeChallengeNumber)) {
    const stepNumber = state.activeChallengeNumber || BAPTISM_STEP_NUMBER;
    state.baptismCompleted = true;
    state.baptismTone = "success";
    state.baptismMessage = "Bạn đã ghép đúng 3 dấu chỉ của biến cố Chúa chịu phép rửa.";
    progress.completed.add(stepNumber);
    const nextStep = activeJourneyMilestones.find((item) => item.number > stepNumber);
    if (nextStep) progress.unlocked.add(nextStep.number);

    if (!state.rewardedSteps.has(stepNumber)) {
      progress.faithPoints += Number(challenge.rewardPoints || BAPTISM_REWARD_POINTS) || 0;
      progress.fragments = Math.min(progress.totalFragments, progress.fragments + 1);
      state.rewardedSteps.add(stepNumber);
      state.baptismRewarded = true;
    }
  }

  function handleBaptismChoice(signId) {
    const challenge = getChallengeForStep(state.activeChallengeNumber);
    const option = challenge.options.find((item) => item.id === signId);
    if (!option || state.baptismCompleted) return;

    if (!option.correct) {
      state.baptismTone = "error";
      state.baptismMessage = `${option.label} không thuộc biến cố Chúa chịu phép rửa. Hãy chọn dấu chỉ khác.`;
      renderBaptismChallenge();
      return;
    }

    state.baptismSelectedSigns.add(signId);
    state.baptismTone = "info";
    state.baptismMessage = `${option.label} đã được đặt đúng.`;

    if (isBaptismChallengeComplete(challenge)) {
      completeBaptismChallenge(challenge);
    }

    renderBaptismChallenge();
  }
  function renderPagination(totalItems) {
    const pageCount = Math.max(1, Math.ceil(totalItems / state.pageSize));
    if (state.page > pageCount) state.page = pageCount;
    if (pageCount <= 1) {
      pagination.innerHTML = "";
      return;
    }

    pagination.innerHTML = Array.from({ length: pageCount }, (_, index) => {
      const page = index + 1;
      return `<button class="${page === state.page ? "active" : ""}" type="button" data-page="${page}">${page}</button>`;
    }).join("");
  }

  function renderTopics() {
    const filtered = getFilteredTopics();
    renderPagination(filtered.length);
    const start = (state.page - 1) * state.pageSize;
    const pageItems = filtered.slice(start, start + state.pageSize);

    grid.innerHTML = pageItems.length
      ? pageItems
          .map(
            (topic) => `
              <button class="faith-picker-item journey-topic-card ${topic.enabled ? "is-ready" : ""}" type="button" data-topic-id="${topic.id}">
                ${topic.pickerImageUrl ? `<img class="journey-topic-image" src="${escapeAttr(topic.pickerImageUrl)}" alt="" loading="lazy" />` : ""}
                <span>${topic.label}</span>
                <strong>${topic.title}</strong>
              </button>
            `
          )
          .join("")
      : `<p class="journey-empty">Chưa có chủ đề Hành trình Kinh Thánh.</p>`;
  }

  function renderStepDetail(step) {
    const status = getStepStatus(step);
    const isPlayable = status === "completed" || status === "available";
    return `
      <div class="journey-guide-content" data-status="${status}">
        <span>${statusText(status)}</span>
        <strong>${step.number}. ${step.title}</strong>
        <small>${step.region} · ${step.reference}</small>
        <p>${isPlayable ? step.story : "Hoàn thành các cột mốc trước để mở khóa chặng này."}</p>
        <em>${isPlayable ? step.lesson : "Con đường sẽ sáng lên khi bạn đủ điều kiện khám phá."}</em>
        <button class="journey-start-challenge" type="button" data-step="${step.number}" ${isPlayable ? "" : "disabled"}>Bắt đầu thử thách</button>
      </div>
    `;
  }

  function getStepImageUrl(step) {
    const challenge = getChallengeForStep(step.number);
    return String(step.cardImageUrl || challenge.sceneImageUrl || "").trim();
  }

  function renderMilestonePopup() {
    const step = activeJourneyMilestones.find((item) => item.number === state.detailStepNumber);
    if (!step) return "";
    const imageUrl = getStepImageUrl(step);
    const metaHtml = [step.region, step.reference]
      .map((value) => renderAdminHtml(value).trim())
      .filter(Boolean)
      .map((value) => `<span>${value}</span>`)
      .join("");
    return `
      <div class="journey-milestone-modal" role="dialog" aria-modal="true" aria-label="${escapeAttr(step.title)}">
        <button class="journey-milestone-modal-backdrop" type="button" data-close-milestone aria-label="Đóng"></button>
        <article class="journey-milestone-panel">
          <button class="journey-milestone-close" type="button" data-close-milestone aria-label="Đóng">×</button>
          ${
            imageUrl
              ? `<img class="journey-milestone-image" src="${escapeAttr(imageUrl)}" alt="${escapeAttr(step.title)}" loading="lazy" />`
              : `<div class="journey-milestone-image placeholder" aria-hidden="true"><span>${step.number}</span></div>`
          }
          <div class="journey-milestone-content">
            <h2>${escapeHtml(step.title)}</h2>
            ${metaHtml ? `<p class="journey-milestone-meta">${metaHtml}</p>` : ""}
            <div class="journey-milestone-html">${renderAdminHtml(step.story)}</div>
            <blockquote>${renderAdminHtml(step.lesson)}</blockquote>
          </div>
        </article>
      </div>
    `;
  }

  function renderBaptismChallenge() {
    const stepNumber = state.activeChallengeNumber || BAPTISM_STEP_NUMBER;
    const step = activeJourneyMilestones.find((item) => item.number === stepNumber) || activeJourneyMilestones.find((item) => item.number === BAPTISM_STEP_NUMBER) || activeJourneyMilestones[0];
    const challenge = getChallengeForStep(stepNumber);
    const selectedCount = challenge.targets.filter((target) => state.baptismSelectedSigns.has(target.signId)).length;
    const rewardPoints = Number(challenge.rewardPoints || BAPTISM_REWARD_POINTS) || 0;
    const emptyChallengeMessage = "Cột mốc này chưa có dữ liệu thử thách. Vui lòng bổ sung câu hỏi trong trang quản lý.";
    const message = state.baptismMessage || "Hãy chọn Nước sông, Chim bồ câu và Tiếng từ trời.";

    gameRoot.innerHTML = `
      <section class="journey-challenge-screen" aria-label="Thử thách ${step.title}">
        <button class="journey-challenge-back" type="button" id="journeyBackToMap">← Quay lại bản đồ</button>

        <header class="journey-challenge-hero">
          <span>Chặng ${step.number} · ${step.reference}</span>
          <h1>${step.title}</h1>
          <p>${challenge.title}</p>
        </header>

        <div class="journey-baptism-layout">
          <section class="journey-baptism-scene ${challenge.sceneImageUrl ? "has-custom-image" : ""}" aria-label="Khung cảnh sông Giođan">
            ${challenge.sceneImageUrl
              ? `<img class="journey-baptism-custom-image" src="${escapeAttr(challenge.sceneImageUrl)}" alt="${escapeAttr(step.title)}" />`
              : `
                <div class="journey-baptism-sky"></div>
                <div class="journey-baptism-light"></div>
                <div class="journey-baptism-river"></div>
                <div class="journey-baptism-figure jesus"><span></span></div>
                <div class="journey-baptism-figure john"><span></span></div>
                <p>Sông Giođan</p>
              `}
          </section>

          <section class="journey-sign-board">
            <div class="journey-sign-head">
              <span>${selectedCount}/${challenge.targets.length}</span>
              <div>
                <strong>${challenge.instruction}</strong>
                <small>Chọn đúng để mở lời Kinh Thánh và nhận thưởng.</small>
              </div>
            </div>

            <div class="journey-sign-slots" aria-label="Ba dấu chỉ cần tìm">
              ${challenge.targets
                .map((target, index) => {
                  const isFilled = state.baptismSelectedSigns.has(target.signId);
                  return `
                    <div class="journey-sign-slot ${isFilled ? "filled" : ""}">
                      <span>${index + 1}</span>
                      <strong>${target.label}</strong>
                      <small>${isFilled ? target.reveal : target.hint}</small>
                    </div>
                  `;
                })
                .join("")}
            </div>

            <div class="journey-sign-options" aria-label="Các dấu chỉ để chọn">
              ${challenge.options
                .map((option) => {
                  const isSelected = state.baptismSelectedSigns.has(option.id);
                  return `
                    <button
                      class="journey-sign-option ${isSelected ? "selected" : ""}"
                      type="button"
                      data-sign="${option.id}"
                      ${isSelected || state.baptismCompleted ? "disabled" : ""}
                    >
                      <span>${option.icon}</span>
                      <strong>${option.label}</strong>
                      <small>${option.text}</small>
                    </button>
                  `;
                })
                .join("")}
            </div>

            <p class="journey-challenge-message ${state.baptismTone}">${challenge.options.length ? message : emptyChallengeMessage}</p>

            ${
              state.baptismCompleted
                ? `
                  <div class="journey-challenge-result">
                    <blockquote>“${challenge.verse}”<span>${challenge.verseRef}</span></blockquote>
                    <p>+${rewardPoints} điểm đức tin · Mở khóa 1 mảnh Kinh Thánh</p>
                    <button class="journey-return-map" type="button">Tiếp tục hành trình</button>
                  </div>
                `
                : ""
            }
          </section>
        </div>
      </section>
    `;
  }
  function renderJourneyGame() {
    const selectedStep = activeJourneyMilestones.find((step) => step.number === state.selectedStepNumber) || activeJourneyMilestones[0];
    const pathPoints = activeJourneyMilestones.map((step) => `${step.x},${step.y}`).join(" ");

    gameRoot.innerHTML = `
      <div class="journey-game-layout journey-map-info-layout">
        <button class="journey-back-to-topics" type="button" id="journeyBackToTopics">← Quay lại chọn chủ đề</button>
        <div class="journey-map-guide-panel">BẠN HÃY CHỌN CÁC VÒNG TRÒN CỘT MỐC ĐỂ XEM</div>
        <div class="journey-map-stage" style="--journey-map-image: url('${escapeAttr(activeJourneyMapImage)}')">

        <section class="journey-hud" aria-label="Tiến trình người chơi">
          <div><strong>★</strong><span>Điểm đức tin</span><b>${progress.faithPoints}</b></div>
          <div><strong>▰</strong><span>Mảnh Kinh Thánh</span><b>${progress.fragments}/${progress.totalFragments}</b></div>
          <div><strong>◇</strong><span>Huy hiệu</span><b>${progress.badges}</b></div>
        </section>

        <div class="journey-actions" aria-label="Tác vụ nhanh">
          <button type="button">Suy niệm</button>
          <button type="button">Phần thưởng</button>
        </div>

        <div class="journey-compass" aria-hidden="true"><span>N</span><span>E</span><span>S</span><span>W</span></div>

        <svg class="journey-road-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <polyline points="${pathPoints}" />
        </svg>

        <div class="journey-milestones" aria-label="Các cột mốc hành trình">
          ${activeJourneyMilestones
            .map((step) => {
              const status = getStepStatus(step);
              return `
                <button
                  class="journey-step-card journey-step-hotspot ${status} ${step.number === selectedStep.number ? "selected" : ""}"
                  type="button"
                  data-step="${step.number}"
                  data-step-number="${step.number}"
                  style="--x:${step.x}%;--y:${step.y}%"
                  aria-label="${step.title} - ${statusText(status)}"
                >
                  <span class="journey-step-number">${step.number}</span>
                  <span class="journey-step-lock" aria-hidden="true">${status === "locked" ? "▣" : status === "completed" ? "✓" : ""}</span>
                </button>
              `;
            })
            .join("")}
        </div>

        <aside class="journey-legend" aria-label="Chú thích trạng thái">
          <h2>Chú thích</h2>
          <p><span class="completed"></span>Đã hoàn thành</p>
          <p><span class="available"></span>Có thể khám phá</p>
          <p><span class="upcoming"></span>Sắp mở khóa</p>
          <p><span class="locked"></span>Chưa mở khóa</p>
        </aside>

        <blockquote class="journey-verse">
          “Hãy đi khắp thế gian, loan báo Tin Mừng cho mọi loài thọ tạo.”<br />
          <span>Mc 16,15</span>
        </blockquote>

        ${renderMilestonePopup()}
        </div>
      </div>
    `;
  }

  function showJourneyGame(topicId) {
    const topic = journeyTopicDetails.get(topicId) || (topicId === JESUS_TOPIC_ID ? { milestones: jesusMilestones, challenges: journeyChallenges } : null);
    if (!topic) return;

    activeJourneyMilestones = topic.milestones?.length ? topic.milestones : fallbackMilestonesForTopic(topic);
    if (!activeJourneyMilestones.length && topicId === JESUS_TOPIC_ID) activeJourneyMilestones = jesusMilestones;
    activeJourneyMapImage = journeyMapImageForTopic(topic);
    journeyChallenges = topic.challenges && typeof topic.challenges === "object" ? topic.challenges : {};
    if (topicId === JESUS_TOPIC_ID && !Object.keys(journeyChallenges).length) {
      journeyChallenges = { [String(BAPTISM_STEP_NUMBER)]: baptismChallenge };
    }

    document.body.classList.remove("faith-choosing-set");
    document.body.classList.add("journey-playing");
    document.body.classList.remove("journey-challenge-mode");
    picker.hidden = true;
    game.hidden = false;
    state.activeView = "map";
    state.selectedStepNumber = activeJourneyMilestones[0]?.number || BAPTISM_STEP_NUMBER;
    state.detailStepNumber = null;
    renderJourneyGame();
    return;

    if (topicId !== JESUS_TOPIC_ID) {
      alert("Chủ đề này đang được chuẩn bị. Vui lòng bổ sung cột mốc trong trang quản lý.");
      return;
    }

    document.body.classList.remove("faith-choosing-set");
    document.body.classList.add("journey-playing");
    document.body.classList.remove("journey-challenge-mode");
    picker.hidden = true;
    game.hidden = false;
    state.activeView = "map";
    state.selectedStepNumber = BAPTISM_STEP_NUMBER;
    state.detailStepNumber = null;
    renderJourneyGame();
  }

  function returnToTopics() {
    document.body.classList.add("faith-choosing-set");
    document.body.classList.remove("journey-playing");
    document.body.classList.remove("journey-challenge-mode");
    game.hidden = true;
    picker.hidden = false;
    renderTopics();
  }

  function returnToMap() {
    state.activeView = "map";
    state.detailStepNumber = null;
    document.body.classList.remove("journey-challenge-mode");
    renderJourneyGame();
  }

  function startStepChallenge(stepNumber) {
    const step = activeJourneyMilestones.find((item) => item.number === stepNumber);
    if (!step) return;

    state.selectedStepNumber = step.number;
    state.detailStepNumber = step.number;
    state.activeView = "map";
    document.body.classList.remove("journey-challenge-mode");
    renderJourneyGame();
    return;

    const challenge = getChallengeForStep(step.number);
    state.selectedStepNumber = step.number;
    state.activeChallengeNumber = step.number;
    state.activeView = "baptism";
    state.baptismSelectedSigns = progress.completed.has(step.number)
      ? new Set(challenge.targets.map((target) => target.signId))
      : new Set();
    state.baptismMessage = "";
    state.baptismTone = "info";
    state.baptismCompleted = progress.completed.has(step.number);
    state.baptismRewarded = state.rewardedSteps.has(step.number);
    document.body.classList.add("journey-challenge-mode");
    renderBaptismChallenge();
    return;

    if (step.number !== BAPTISM_STEP_NUMBER) {
      alert("Thử thách của chặng này đang được chuẩn bị. Hiện tại mình làm trước chặng Chúa chịu phép rửa.");
      return;
    }

    state.selectedStepNumber = step.number;
    state.activeView = "baptism";
    document.body.classList.add("journey-challenge-mode");
    renderBaptismChallenge();
  }
  searchInput.addEventListener("input", () => {
    state.search = searchInput.value;
    state.page = 1;
    renderTopics();
  });

  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    state.page = 1;
    renderTopics();
  });

  pagination.addEventListener("click", (event) => {
    const button = event.target.closest("[data-page]");
    if (!button) return;
    state.page = Number(button.dataset.page) || 1;
    renderTopics();
  });

  grid.addEventListener("click", (event) => {
    const button = event.target.closest(".journey-topic-card");
    if (!button) return;
    showJourneyGame(button.dataset.topicId);
  });

  gameRoot.addEventListener("click", (event) => {
    const backButton = event.target.closest("#journeyBackToTopics");
    if (backButton) {
      returnToTopics();
      return;
    }

    const backToMapButton = event.target.closest("#journeyBackToMap, .journey-return-map");
    if (backToMapButton) {
      returnToMap();
      return;
    }

    const closeMilestoneButton = event.target.closest("[data-close-milestone]");
    if (closeMilestoneButton) {
      state.detailStepNumber = null;
      renderJourneyGame();
      return;
    }

    const signButton = event.target.closest(".journey-sign-option");
    if (signButton && !signButton.disabled) {
      handleBaptismChoice(signButton.dataset.sign);
      return;
    }

    const stepButton = event.target.closest(".journey-step-card");
    if (stepButton) {
      state.selectedStepNumber = Number(stepButton.dataset.step) || 1;
      startStepChallenge(state.selectedStepNumber);
      return;
    }

    const challengeButton = event.target.closest(".journey-start-challenge");
    if (challengeButton && !challengeButton.disabled) {
      startStepChallenge(Number(challengeButton.dataset.step) || state.selectedStepNumber);
    }
  });
  loadJourneyBibleSettings().finally(renderTopics);
})();
