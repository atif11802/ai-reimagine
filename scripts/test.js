const data = [
	{
		name: 'ceiling',
		url: 'https://cdn.reimaginehome.ai/prod/mask/_segment.png',
		center: {
			y: 56,
			x: 734,
		},
		category: 'architectural',
		area_percent: 3.347677712912088,
	},
	{
		name: 'wall',
		url: 'https://cdn.reimaginehome.ai/prod/mask/5e54fd04-918a-410a-813d-4cbc5e800d9d_segment.png',
		center: {
			y: 496,
			x: 1228,
		},
		category: 'architectural,landscaping',
		area_percent: 41.57720209478022,
	},
	{
		name: 'floor',
		url: 'https://cdn.reimaginehome.ai/prod/mask/96e0e536-1a0a-4d57-b7f5-ddd7e99548b0_segment.png',
		center: {
			y: 1232,
			x: 1186,
		},
		category: 'architectural,landscaping',
		area_percent: 15.517828525641026,
	},
	{
		name: 'plant',
		url: 'https://cdn.reimaginehome.ai/prod/mask/6c946fb8-1a5c-4e29-ab55-ba00b8f32c5e_segment.png',
		center: {
			y: 577,
			x: 356,
		},
		category: 'furnishing,landscaping',
		area_percent: 2.7793398008241756,
	},
	{
		name: 'windowpane',
		url: 'https://cdn.reimaginehome.ai/prod/mask/06e95fa2-ce9a-4cca-94ea-3ce8c787a8e8_segment.png',
		center: {
			y: 395,
			x: 252,
		},
		category: 'furnishing,landscaping',
		area_percent: 7.952473958333334,
	},
	{
		name: 'chair',
		url: 'https://cdn.reimaginehome.ai/prod/mask/e0825f5a-b10c-45ac-99cf-c53e4f677a51_segment.png',
		center: {
			y: 905,
			x: 1291,
		},
		category: 'furnishing,landscaping',
		area_percent: 5.182077037545787,
	},
	{
		name: 'shelf',
		url: 'https://cdn.reimaginehome.ai/prod/mask/9b079b82-2d46-4685-b053-9f56eafdd054_segment.png',
		center: {
			y: 693,
			x: 787,
		},
		category: 'furnishing,landscaping',
		area_percent: 3.1784068795787546,
	},
	{
		name: 'cabinet',
		url: 'https://cdn.reimaginehome.ai/prod/mask/ccc3c5ca-2c69-4aeb-a216-807e2f94a884_segment.png',
		center: {
			y: 899,
			x: 224,
		},
		category: 'furnishing,landscaping',
		area_percent: 3.967490842490842,
	},
	{
		name: 'lamp',
		url: 'https://cdn.reimaginehome.ai/prod/mask/4b02cee1-cb96-43d8-9260-75b4ba8f12d8_segment.png',
		center: {
			y: 248,
			x: 1542,
		},
		category: 'furnishing',
		area_percent: 1.5604252518315018,
	},
	{
		name: 'table',
		url: 'https://cdn.reimaginehome.ai/prod/mask/04b5c7b1-8a38-49a7-9eb2-54901ddd9ad1_segment.png',
		center: {
			y: 944,
			x: 1208,
		},
		category: 'furnishing,landscaping',
		area_percent: 0.9004764766483516,
	},
	{
		name: 'coffee',
		url: 'https://cdn.reimaginehome.ai/prod/mask/2c069422-23e8-4fa6-b461-9e064c67db69_segment.png',
		center: {
			y: 907,
			x: 1121,
		},
		category: 'furnishing',
		area_percent: 0.027222126831501832,
	},
	{
		name: 'flower',
		url: 'https://cdn.reimaginehome.ai/prod/mask/f2dc5adc-fe86-4437-a5e8-4e595b27dc43_segment.png',
		center: {
			y: 761,
			x: 1202,
		},
		category: 'furnishing,landscaping',
		area_percent: 0.14122596153846154,
	},
	{
		name: 'book',
		url: 'https://cdn.reimaginehome.ai/prod/mask/1051eb87-dc86-4c08-a4fb-5912528b9e0e_segment.png',
		center: {
			y: 747,
			x: 851,
		},
		category: 'furnishing',
		area_percent: 6.356456043956044,
	},
	{
		name: 'television',
		url: 'https://cdn.reimaginehome.ai/prod/mask/0432561f-3de5-4996-9c35-1e66ed58ee56_segment.png',
		center: {
			y: 113,
			x: 23,
		},
		category: 'furnishing',
		area_percent: 0.36011189331501836,
	},
	{
		name: 'cushion',
		url: 'https://cdn.reimaginehome.ai/prod/mask/de7074c6-6f76-4a8d-869d-79b88f3a5096_segment.png',
		center: {
			y: 819,
			x: 1291,
		},
		category: 'furnishing,landscaping',
		area_percent: 2.6503476991758244,
	},
	{
		name: 'vase',
		url: 'https://cdn.reimaginehome.ai/prod/mask/738727bf-489c-4566-9ede-67cfc847ce28_segment.png',
		center: {
			y: 1081,
			x: 466,
		},
		category: 'furnishing,landscaping',
		area_percent: 1.0513607486263736,
	},
	{
		name: 'sink',
		url: 'https://cdn.reimaginehome.ai/prod/mask/711ea54d-fe2b-458f-94e5-5a7bf2253629_segment.png',
		center: {
			y: 933,
			x: 1957,
		},
		category: 'furnishing',
		area_percent: 0.7238367101648352,
	},
	{
		name: 'ottoman',
		url: 'https://cdn.reimaginehome.ai/prod/mask/0c69456b-56c4-42d0-9000-bd8c37f01930_segment.png',
		center: {
			y: 1061,
			x: 1044,
		},
		category: 'furnishing,landscaping',
		area_percent: 2.726040235805861,
	},
];

const furnishingUrls = data
	.filter((item) => item.category.includes('furnishing'))
	.map((item) => item.url);

console.log(furnishingUrls);
