'use strict'

const Helpers = use('Helpers');
const Drive = use('Drive');

class FileController {

	async upload ({ request, response }) {

        const validationOptions = {
            types: ['image'],
            size: '1mb',
		};

        const imageFile = request.file('image', validationOptions);

        //return imageFile

        await imageFile.move(Helpers.tmpPath('tmp_uploads'), {
            name: `${new Date().getTime()}.${imageFile.subtype}`,
            overwrite: true,
        });

        if (!imageFile.moved()) {
            return imageFile.error();
        }
        return response.json({
            status: 'success',
            fileName : imageFile.fileName
        })
	}

	async uploadMultiple ({ request }) {

		const files = request.file('files', {
			types: ['image'],
			size: '2mb'
		})

		return file.size;

		const myFiles = files.files

        const validationOptions = {
            types: ['image'],
            size: '1mb',
		};

        const imageFile = request.file('image', validationOptions);


        await imageFile.move(Helpers.tmpPath('uploads'), {
            name: 'myImage.jpg',
            overwrite: true,
        });

        if (!imageFile.moved()) {
            return imageFile.error();
        }
        return 'File uploaded';
	}

	async download ({ params, response }) {
        const filePath = `tmp_uploads/${params.fileName}`;
        const isExist = await Drive.exists(filePath);

        if (isExist) {
            return response.download(Helpers.tmpPath(filePath));
        }
        return 'File does not exist';
    }

    async file({params : {dir, file}, response}) {
        if (await Drive.exists(Helpers.publicPath(`${dir}/${file}`))) {
            return response.download(Helpers.publicPath(`${dir}/${file}`))
        }
        return 'File does not exist'
    }

}

module.exports = FileController
