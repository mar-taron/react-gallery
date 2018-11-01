export default function prepareArray(array, title) {
	const prepatedArray = [];
	const resize = '/resize=height:200/';
	const resize70 = '/resize=height:70/';
	let item = {};
	let srcParams = [];
	let thumbnail = '';
	let thumbnailSmall = '';
	let tumbImagesize = {};
	array.map((src, i)=>{
        srcParams = src.split('/');
        thumbnail = srcParams[0] + '//' + srcParams[2] + resize + srcParams[3];
        thumbnailSmall = srcParams[0] + '//' + srcParams[2] + resize70 + srcParams[3];
	    item = {
        	src,
            thumbnail,
            thumbnailSmall,
            thumbnailHeight: 200,
            thumbnailWidth: 300,
            caption: title + ' N' + (i + 1),
            percent: 0
        }
        prepatedArray.push(item)
	})

	if(!localStorage.getItem('images')) {
		localStorage.setItem('images', JSON.stringify(prepatedArray));
	}
	return prepatedArray;	
}