export default function prepareArray(array, title) {
	const prepatedArray = [];
	const resize = '/resize=height:200/';
	let item = {};
	let srcParams = [];
	let thumbnail = '';
	let tumbImagesize = {};
	array.map((src, i)=>{
        srcParams = src.split('/');
        thumbnail = srcParams[0] + '//' + srcParams[2] + resize + srcParams[3];
	    item = {
        	src,
            thumbnail,
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