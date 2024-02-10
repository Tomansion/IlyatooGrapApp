import services.ilyatooManager as ilyatooManager
import config.init_config as config


def init():
    # Init config file
    config.init_config()

    # Init database
    ilyatooManager.setup()
